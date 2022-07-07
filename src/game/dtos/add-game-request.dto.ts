import { ApiProperty } from "@nestjs/swagger";

export class AddGameRequest {
    @ApiProperty()
    name!: string;
}