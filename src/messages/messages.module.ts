import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, User]),
    UsersModule,
  ],
  providers: [MessagesService, MessagesResolver],
})
export class MessagesModule {}