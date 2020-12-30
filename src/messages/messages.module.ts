import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { ProductsModule } from 'src/products/products.module';
import { User } from 'src/users/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, User]),
    CaslModule,
    ProductsModule,
  ],
  providers: [MessagesService, MessagesResolver],
})
export class MessagesModule {}
