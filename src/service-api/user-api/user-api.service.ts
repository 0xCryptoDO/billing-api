import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { apiUrls } from 'src/constants';

export class User {
  wallet: string;
  referralUserId: string;
}

@Injectable()
export class UserApiService {
  public async getById(id: string): Promise<User> {
    const res = await axios.get(`${apiUrls.userApi}/users/${id}`);
    return res.data;
  }
}
