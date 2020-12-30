import { BadRequestException, Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Resolver,
  Query,
  Subscription,
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslService } from 'src/casl/casl.service';
import { Action } from 'src/casl/types/casl.types';
import { ProductsService } from 'src/products/products.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MessageArgs } from './dto/message.args';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => Conversation)
export class MessagesResolver {
  constructor(
    private messagesService: MessagesService,
    private productsService: ProductsService,
    private caslService: CaslService,
    @Inject('PUB_SUB')
    private pubSub: RedisPubSub,
  ) {}

  @Subscription(() => String)
  messageAdded() {
    return this.pubSub.asyncIterator('messageAdded');
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLSessionGuard)
  async createConversation(
    @CurrentUser() user: User,
    @Args('productId', { type: () => Int }) productId: number,
    @Args() message: MessageArgs,
  ) {
    this.caslService.checkAbilityForConversation(
      Action.Create,
      user,
      Conversation,
    );

    const product = await this.productsService.findProductById(productId);
    if (!product.isPublished) {
      throw new BadRequestException('This product is not published');
    }
    if (product.user.id === user.id) {
      throw new BadRequestException('Can not send message to yourself');
    }

    await this.messagesService.createConversation(user, product, message);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLSessionGuard)
  async createMessage(
    @CurrentUser() user: User,
    @Args({ name: 'conversation', type: () => Int }) conversationId: number,
    @Args() message: MessageArgs,
  ) {
    const conversation = await this.messagesService.getConversation(
      conversationId,
    );
    this.caslService.checkAbilityForConversation(
      Action.Update,
      user,
      Conversation,
      conversation.participants,
    );
    await this.messagesService.createMessage(user, message, conversation);
    this.pubSub.publish('messageAdded', {
      messageAdded: `Added ${message.text}`,
    });
    return true;
  }

  @Query(() => [Message])
  @UseGuards(GQLSessionGuard)
  getUserMessages(@CurrentUser() user: User) {
    return this.messagesService.getUserMessages(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLSessionGuard)
  readMessage(
    @CurrentUser() user: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ) {
    return this.messagesService.readMessage(id, user);
  }

  @Query(() => Conversation)
  @UseGuards(GQLSessionGuard)
  async getConversation(
    @CurrentUser() user: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ) {
    const conversation = await this.messagesService.getConversation(id);
    this.caslService.checkAbilityForConversation(
      Action.Read,
      user,
      Conversation,
      conversation.participants,
    );
    return conversation;
  }
}
