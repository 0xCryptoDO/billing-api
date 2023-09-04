import { Currencies } from '@cryptodo/contracts';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CalculateCostDto,
  CalculateCostResDto,
} from './dto/calculate-cost.dto';
import { reduce } from 'lodash';
import axios from 'axios';
import { useCache } from '@cryptodo/common';
import { ContractType } from '@cryptodo/contracts';
import { apiUrls } from './billing.constants';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Bill, BillDocument } from './schemas';
import { Rate } from './types/rate.types';
import { UserApiService } from 'src/service-api/user-api/user-api.service';
import { RatesService } from './rates.service';

@Injectable()
export class BillingService {
  private coinGeckoCoinsList: Array<{
    id: string;
    symbol: string;
    name: string;
  }>;
  constructor(
    @InjectModel(Bill.name)
    private billModel: Model<BillDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userApiService: UserApiService,
    private ratesService: RatesService,
  ) {
    this.getCoinsList();
  }

  private async getCoinsList() {
    const res = await axios.get(`${apiUrls.coinGecko}/coins/list`);
    this.coinGeckoCoinsList = res.data;
  }

  private async getPriceFronCoinGecko(currency: Currencies): Promise<number> {
    const defaultCurrencyName = 'usd';

    const coin = this.coinGeckoCoinsList.find(
      (c) => c.symbol === currency.toLowerCase(),
    );
    const res = await axios.get(`${apiUrls.coinGecko}/simple/price`, {
      params: { ids: coin.id, vs_currencies: defaultCurrencyName },
    });
    return res.data[coin.id][defaultCurrencyName];
  }

  private async getPriceFromBinance(currency: Currencies): Promise<number> {
    const res = await axios.get(apiUrls.priceFromBinance, {
      params: { symbol: currency + 'USDT' },
    });
    return res.data?.price;
  }

  private validateOptions(type: ContractType, options: string[], rates: Rate) {
    for (const option of options || []) {
      if (!rates.extra[option]) {
        throw new BadRequestException(null, `Unknown option: ${option}`);
      }
    }
  }

  public async pushTxIfNotExists(id: Types.ObjectId, userId: string) {
    return this.billModel.findOneAndUpdate(
      { userId },
      {
        $addToSet: { transactions: id },
        $setOnInsert: { userId },
      },
      { new: true, upsert: true },
    );
  }

  public async calculateCost(
    params: CalculateCostDto,
    userId: string,
  ): Promise<CalculateCostResDto> {
    const user = await this.userApiService.getById(userId);
    const rate = this.ratesService.getRates(
      user.wallet,
      params.type,
      params.network,
    );
    if (!rate) {
      throw new BadRequestException(null, `Unknown type: ${params.type}`);
    }

    this.validateOptions(params.type, params.options, rate);

    const cost = reduce(
      params.options || [],
      (obj, option) => {
        const optionCost = rate.extra[option];
        return {
          total: Math.round((obj.total + optionCost) * 100) / 100,
          options: { [option]: optionCost, ...obj.options },
        };
      },
      { total: rate.base, options: {} },
    );

    if (params.currency === Currencies.usd) {
      return cost;
    }

    if (params.currency === Currencies.cdo) {
      return {
        total: cost.total / this.ratesService.cdoUsdPrice,
        options: cost.options,
        usdEq: Math.round(cost.total * 100) / 100,
      };
    }

    const price = await useCache<number>(
      this.cacheManager,
      `price:${params.currency}`,
      async () => {
        return await this.getPriceFronCoinGecko(params.currency);
      },
      { ttl: 30 },
    );

    return {
      total: +(cost.total / price).toFixed(18),
      options: {},
      usdEq: Math.round(cost.total * 100) / 100,
    };
  }
}
