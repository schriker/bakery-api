import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/messages/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { Action } from './types/casl.types';

type Subjects = typeof Conversation | typeof User | Conversation | User | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslConversationAbilityFactory {
  createForUser(user: User, participants: User[] = []) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    const participantsIds = participants.map((participant) => participant.id);

    if (user.isVerified && participantsIds.includes(user.id)) {
      can(Action.Read, Conversation);
      can(Action.Update, Conversation);
    }

    if (user.isVerified) {
      can(Action.Create, Conversation);
    }

    return build();
  }
}
