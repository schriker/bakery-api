import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslService } from 'src/casl/casl.service';
import { Action } from 'src/casl/types/casl.types';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MessageArgs } from './dto/message.args';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver(() => Conversation)
export class MessagesResolver {
  constructor(
    private messagesService: MessagesService,
    private usersService: UsersService,
    private caslService: CaslService,
  ) {}

  // Guard Conversations Read and Write only for participants
  // Check if user confirm email
  @Mutation(() => Boolean)
  @UseGuards(GQLSessionGuard)
  async createConversation(
    @CurrentUser() user: User,
    @Args('to', { type: () => Int }) to: number,
    @Args() message: MessageArgs,
  ) {
    if (to === user.id) {
      throw new BadRequestException('Can not send messages to yourself');
    }
    this.caslService.checkAbilityForConversation(
      Action.Create,
      user,
      Conversation,
    );
    const toUser = await this.usersService.findUserById(to);
    await this.messagesService.createConversation(user, toUser, message);
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
