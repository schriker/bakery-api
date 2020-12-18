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

  async getUserMessages(user: User) {
    const [
      userWithConversations,
    ] = await this.usersRepository
      .createQueryBuilder('u')
      .select()
      .where('u.id = :id', { id: user.id })
      .leftJoinAndSelect('u.conversations', 'c')
      .getMany();

    const result = await this.messagesRepository.query(
      `SELECT * FROM
        (
          SELECT
            DISTINCT ON ("m"."conversationId") "m"."id" AS "m_id",
            "m"."createdAt" AS "m_createdAt",
            "m"."updatedAt" AS "m_updatedAt",
            "m"."text" AS "m_text",
            "m"."userId" AS "m_userId",
            "m"."conversationId" AS "m_conversationId",
            "u"."id" AS "u_id",
            "u"."email" AS "u_email",
            "u"."firstName" AS "u_firstName",
            "u"."lastName" AS "u_lastName",
            "u"."isVerified" AS "u_isVerified",
            "u"."isSeller" AS "u_isSeller",
            "u"."createdAt" AS "u_createdAt",
            "u"."updatedAt" AS "u_updatedAt",
            "u"."cityId" AS "u_cityId",
            "c"."id" AS "c_id",
            "c"."createdAt" AS "c_createdAt",
            "c"."updatedAt" AS "c_updatedAt"
          FROM
            "message" "m"
            LEFT JOIN "user" "u" ON "u"."id" = "m"."userId"
            LEFT JOIN "conversation" "c" ON "c"."id" = "m"."conversationId"
          WHERE
            "m"."conversationId" = ANY($1)
          ORDER BY
            "m"."conversationId",
            "m"."createdAt" DESC
        ) messages ORDER BY "messages"."m_createdAt" DESC;
      `,
      [userWithConversations.conversations.map((c) => c.id)],
    );

    const messages: Message[] = result.map((message) => {
      return {
        id: message.m_id,
        text: message.m_text,
        createdAt: message.m_createdAt,
        user: {
          firstName: message.u_firstName,
        },
        conversation: {
          id: message.c_id,
        },
      };
    });

    return messages;
  }

  async getConversation(id: number) {
    const conversation = await this.conversationsRepository.findOne(id, {
      relations: ['participants'],
    });

    const messages = await this.messagesRepository.find({
      where: {
        conversation: conversation,
      },
      relations: ['user'],
    });

    return {
      ...conversation,
      messages: messages,
    };
  }

  async createMessage(
    user: User,
    message: MessageArgs,
    conversation: Conversation,
  ) {
    return this.messagesRepository
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values({
        user: user,
        text: message.text,
        conversation: conversation,
      })
      .execute();
  }
}