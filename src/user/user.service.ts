import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { UserProfile } from 'microservices/ftf-user/src/domain/entities/user-profile.entity';
import { MicroserviceResponse } from 'src/common/dtos/microservice-response.dto';
import { UserProfileResponse } from './dtos/user-profile-response.dto';

@Injectable()
export class UserService {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

    async getProfile(id: number) {
        const observable = await this.userClient.send({ cmd: 'get-profile' }, { userId: id })

        const resp = await new Promise<MicroserviceResponse>((resolve) => {
            observable.subscribe((data) => {
                resolve(data);
            })
        })

        if(resp.message === 'getting-profile-failed') throw new NotFoundException(resp.data);

        if(resp.data instanceof UserProfileResponse) return resp.data;
        else throw new InternalServerErrorException('Data is not instance of UserProfileResponse');
    }

    async getProfiles() {
        const observable = await this.userClient.send({ cmd: 'get-all-users-profiles'}, {});

        const resp = await new Promise<MicroserviceResponse>((resolve) => {
            observable.subscribe((data) => {
                resolve(data);
            })
        })

        if(resp.message === 'getting-profile-failed') throw new InternalServerErrorException(resp.data);

        const responseArray: UserProfileResponse[] = [];

        if(Array.isArray(resp.data)) {
            const arr = resp.data;

            for(let i = 0; i < arr.length; i += 1) {
                const item = arr[i];
                if(item instanceof UserProfileResponse) responseArray.push(item);
                else throw new InternalServerErrorException('Item of data array is not instance of UserProfileResponse');
            }
        }
    }
}
