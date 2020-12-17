import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MessageArgs } from './dto/message.args';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createConversation(from: User, to: User, message: MessageArgs) {
    const conversationData = new Conversation();
    conversationData.participants = [from, to];
    await this.conversationsRepository.save(conversationData);

    const messageData = new Message();
    messageData.text = message.text;
    messageData.user = from;
    messageData.conversation = conversationData;
    await this.messagesRepository.save(messageData);
  }

  async getUserConversations(user: User) {
    const [
      userWithConversations,
    ] = await this.usersRepository
      .createQueryBuilder('u')
      .select()
      .where('u.id = :id', { id: user.id })
      .leftJoinAndSelect('u.conversations', 'c')
      .leftJoinAndSelect('c.messages', 'm')
      .leftJoinAndSelect('c.participants', 'p')
      .orderBy('m.createdAt', 'DESC')
      .getMany();
    return userWithConversations.conversations;
  }

  async getConversationMessages(id: number) {
    const [
      conversation,
    ] = await this.conversationsRepository
      .createQueryBuilder('c')
      .select()
      .where('c.id = :id', { id: id })
      .leftJoinAndSelect('c.participants', 'p')
      .leftJoinAndSelect('c.messages', 'm')
      .leftJoinAndSelect('m.user', 'u')
      .getMany();

    return conversation;
  }
}
