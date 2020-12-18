import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
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
    const toUser = await this.usersService.findUserById(to);
    this.messagesService.createConversation(user, toUser, message);
    return true;
  }

  // Check if user can participate to that conversation
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
    await this.messagesService.createMessage(user, message, conversation);
    return true;
  }

  @Query(() => [Message])
  @UseGuards(GQLSessionGuard)
  getUserMessages(@CurrentUser() user: User) {
    return this.messagesService.getUserMessages(user);
  }

  // Check if user is one of participant to read conversation
  @Query(() => Conversation)
  @UseGuards(GQLSessionGuard)
  async getConversation(@CurrentUser() user: User, @Args('id') id: number) {
    const conversation = await this.messagesService.getConversation(id);

    return conversation;
  }
}
