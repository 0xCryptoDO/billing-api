import { ContractType, IERC20Contract } from '@cryptodo/contracts';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { apiUrls, contractPaths } from 'src/constants';

@Injectable()
export class ContractApiService {
  public async getContractById(
    id: string,
    type: ContractType,
  ): Promise<IERC20Contract> {
    const res = await axios.get(
      `${apiUrls.contractApi}/${contractPaths[type]}/${id}`,
    );
    return res.data;
  }
}
