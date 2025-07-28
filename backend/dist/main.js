"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true
    });
    console.log(`CORS configured for origin: ${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map