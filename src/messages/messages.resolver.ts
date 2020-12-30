import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
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
  ) {}

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
    @Args('conversation') conversationId: number,
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
    return true;
  }

  @Query(() => [Message])
  @UseGuards(GQLSessionGuard)
  getUserMessages(@CurrentUser() user: User) {
    return this.messagesService.getUserMessages(user);
  }

  @Query(() => Conversation)
  @UseGuards(GQLSessionGuard)
  async getConversation(@CurrentUser() user: User, @Args('id') id: number) {
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
