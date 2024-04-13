import { EventSceneType, EventType } from './telegram-transport.dto';

export const Transport = {
  TELEGRAM: 'TELEGRAM',
  TELEGRAM_SCENE: 'TELEGRAM_SCENE',
};

const _events: EventType[] = [
  'command',
  'hears',
  'text',
  'sticker',
  'animation',
  'audio',
  'document',
  'photo',
  'video',
  'video_note',
  'voice',
  'callback_query',
  'channel_post',
  'chat_member',
  'chosen_inline_result',
  'edited_channel_post',
  'edited_message',
  'inline_query',
  'message',
  'my_chat_member',
  'pre_checkout_query',
  'poll_answer',
  'poll',
  'shipping_query',
  'chat_join_request',
  'has_media_spoiler',
  'forward_date',
  'contact',
  'dice',
  'location',
  'new_chat_members',
  'left_chat_member',
  'new_chat_title',
  'new_chat_photo',
  'delete_chat_photo',
  'group_chat_created',
  'supergroup_chat_created',
  'channel_chat_created',
  'message_auto_delete_timer_changed',
  'migrate_to_chat_id',
  'migrate_from_chat_id',
  'pinned_message',
  'invoice',
  'successful_payment',
  // 'user_shared',
  'chat_shared',
  'connected_website',
  'write_access_allowed',
  'passport_data',
  'proximity_alert_triggered',
  'forum_topic_created',
  'forum_topic_edited',
  'forum_topic_closed',
  'forum_topic_reopened',
  'general_forum_topic_hidden',
  'general_forum_topic_unhidden',
  'video_chat_scheduled',
  'video_chat_started',
  'video_chat_ended',
  'video_chat_participants_invited',
  'web_app_data',
  'game',
  'story',
  'venue',
];

export const events: EventType[] = [..._events];
export const eventsScene: EventSceneType[] = [..._events, 'enter', 'leave'];