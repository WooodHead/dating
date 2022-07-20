import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {ExtractJwt} from "passport-jwt";

export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    },
);