import type {Device} from 'homey';
import type Homey from 'homey/lib/Homey';
import type {ShellyDeviceInterface} from '../../device/ShellyDevice';

export type ShellyActionEvent =
  'single_push'
  | 'single_push_1'
  | 'single_push_2'
  | 'single_push_3'
  | 'single_push_4'
  | 'shortpush'
  | 'shortpush_1'
  | 'shortpush_2'
  | 'shortpush_3'
  | 'shortpush_4'
  | 'longpush'
  | 'longpush_1'
  | 'longpush_2'
  | 'longpush_3'
  | 'longpush_4'
  | 'long_push'
  | 'long_push_1'
  | 'long_push_2'
  | 'long_push_3'
  | 'long_push_4'
  | 'double_push'
  | 'double_push_1'
  | 'double_push_2'
  | 'double_push_3'
  | 'double_push_4'
  | 'double_shortpush'
  | 'double_shortpush_1'
  | 'double_shortpush_2'
  | 'double_shortpush_3'
  | 'double_shortpush_4'
  | 'triple_shortpush'
  | 'triple_shortpush_1'
  | 'triple_shortpush_2'
  | 'triple_shortpush_3'
  | 'triple_shortpush_4'
  | 'triple_push'
  | 'triple_push_1'
  | 'triple_push_2'
  | 'triple_push_3'
  | 'triple_push_4'
  | 'longpush_shortpush'
  | 'longpush_shortpush_1'
  | 'longpush_shortpush_2'
  | 'longpush_shortpush_3'
  | 'longpush_shortpush_4'
  | 'shortpush_longpush'
  | 'shortpush_longpush_1'
  | 'shortpush_longpush_2'
  | 'shortpush_longpush_3'
  | 'shortpush_longpush_4'
  | 'btn_down'
  | 'btn_down_1'
  | 'btn_down_2'
  | 'btn_down_3'
  | 'btn_down_4'
  | 'btn_up'
  | 'btn_up_1'
  | 'btn_up_2'
  | 'btn_up_3'
  | 'btn_up_4'
  | 'very_longpush'
  | 'very_longpush_1'
  | 'very_longpush_2'
  | 'very_longpush_3'
  | 'very_longpush_4'
  | 'hold'
  | 'hold_1'
  | 'hold_2'
  | 'hold_3'
  | 'hold_4'
  | 'released'
  | 'released_1'
  | 'released_2'
  | 'released_3'
  | 'released_4';

const eventLabels: Record<ShellyActionEvent, string> = {
  'single_push': 'Single Push',
  'single_push_1': 'Single Push 1',
  'single_push_2': 'Single Push 2',
  'single_push_3': 'Single Push 3',
  'single_push_4': 'Single Push 4',
  'shortpush': 'Short Push',
  'shortpush_1': 'Short Push 1',
  'shortpush_2': 'Short Push 2',
  'shortpush_3': 'Short Push 3',
  'shortpush_4': 'Short Push 4',
  'longpush': 'Long Push',
  'longpush_1': 'Long Push 1',
  'longpush_2': 'Long Push 2',
  'longpush_3': 'Long Push 3',
  'longpush_4': 'Long Push 4',
  'long_push': 'Long Push',
  'long_push_1': 'Long Push 1',
  'long_push_2': 'Long Push 2',
  'long_push_3': 'Long Push 3',
  'long_push_4': 'Long Push 4',
  'double_push': 'Double Push',
  'double_push_1': 'Double Push 1',
  'double_push_2': 'Double Push 2',
  'double_push_3': 'Double Push 3',
  'double_push_4': 'Double Push 4',
  'double_shortpush': 'Double Short Push',
  'double_shortpush_1': 'Double Short Push 1',
  'double_shortpush_2': 'Double Short Push 2',
  'double_shortpush_3': 'Double Short Push 3',
  'double_shortpush_4': 'Double Short Push 4',
  'triple_shortpush': 'Triple Short Push',
  'triple_shortpush_1': 'Triple Short Push 1',
  'triple_shortpush_2': 'Triple Short Push 2',
  'triple_shortpush_3': 'Triple Short Push 3',
  'triple_shortpush_4': 'Triple Short Push 4',
  'triple_push': 'Triple Push',
  'triple_push_1': 'Triple Push 1',
  'triple_push_2': 'Triple Push 2',
  'triple_push_3': 'Triple Push 3',
  'triple_push_4': 'Triple Push 4',
  'longpush_shortpush': 'Long Push Short Push',
  'longpush_shortpush_1': 'Long Push Short Push 1',
  'longpush_shortpush_2': 'Long Push Short Push 2',
  'longpush_shortpush_3': 'Long Push Short Push 3',
  'longpush_shortpush_4': 'Long Push Short Push 4',
  'shortpush_longpush': 'Short Push Long Push',
  'shortpush_longpush_1': 'Short Push Long Push 1',
  'shortpush_longpush_2': 'Short Push Long Push 2',
  'shortpush_longpush_3': 'Short Push Long Push 3',
  'shortpush_longpush_4': 'Short Push Long Push 4',
  'btn_down': 'Button Down',
  'btn_down_1': 'Button Down 1',
  'btn_down_2': 'Button Down 2',
  'btn_down_3': 'Button Down 3',
  'btn_down_4': 'Button Down 4',
  'btn_up': 'Button Up',
  'btn_up_1': 'Button Up 1',
  'btn_up_2': 'Button Up 2',
  'btn_up_3': 'Button Up 3',
  'btn_up_4': 'Button Up 4',
  'very_longpush': 'Very Long Push',
  'very_longpush_1': 'Very Long Push 1',
  'very_longpush_2': 'Very Long Push 2',
  'very_longpush_3': 'Very Long Push 3',
  'very_longpush_4': 'Very Long Push 4',
  'hold': 'Hold',
  'hold_1': 'Hold 1',
  'hold_2': 'Hold 2',
  'hold_3': 'Hold 3',
  'hold_4': 'Hold 4',
  'released': 'Released',
  'released_1': 'Released 1',
  'released_2': 'Released 2',
  'released_3': 'Released 3',
  'released_4': 'Released 4',
};

const eventMap: {
  coap: Record<string, ShellyActionEvent>,
  websocket: Record<string, ShellyActionEvent>,
  cloud: {
    gen1: Record<string, ShellyActionEvent>,
    gen2: Record<string, ShellyActionEvent>,
    bluetooth: Record<string, ShellyActionEvent>,
  },
  bluetooth: Record<string, ShellyActionEvent>,
  zwave: Record<string, ShellyActionEvent>,
} = {
  'coap': {
    'S': 'shortpush',
    'L': 'longpush',
    'SS': 'double_shortpush',
    'SSS': 'triple_shortpush',
    'LS': 'longpush_shortpush',
    'SL': 'shortpush_longpush',
  },
  'websocket': {
    'single_push': 'single_push',
    'long_push': 'long_push',
    'double_push': 'double_push',
    'triple_push': 'triple_push',
    'btn_down': 'btn_down',
    'btn_up': 'btn_up',
  },
  'cloud': {
    'gen1': {
      'S': 'shortpush',
      'L': 'longpush',
      'SS': 'double_shortpush',
      'SSS': 'triple_shortpush',
      'LS': 'longpush_shortpush',
      'SL': 'shortpush_longpush',
    },
    'gen2': {
      'S': 'single_push',
      'L': 'long_push',
      'SS': 'double_push',
      'SSS': 'triple_push',
    },
    'bluetooth': {
      'S': 'shortpush',
      'L': 'longpush',
      'SS': 'double_shortpush',
      'SSS': 'triple_shortpush',
      'LS': 'longpush_shortpush',
      'SL': 'shortpush_longpush',
    },
  },
  'bluetooth': {
    '1': 'shortpush',
    '2': 'double_shortpush',
    '3': 'triple_shortpush',
    '4': 'longpush',
    '5': 'very_longpush',
    '254': 'hold',
  },
  'zwave': {
    'Key Pressed 1 time': 'single_push',
    'Key Held Down': 'long_push',
    'Key Pressed 2 times': 'double_push',
    'Key Released': 'released',
  },
};

type ShellyActionEventArgument = {
  id: number,
  name: string,
  action?: string
};

export function getPossibleActionEventsForDevice(homey: Homey, device: Device & ShellyDeviceInterface): ShellyActionEventArgument[] {
  let actions: ShellyActionEvent[];
  if (device.getPossibleActionEvents !== undefined) {
    actions = device.getPossibleActionEvents();
  } else {
    // todo: remove legacy implementation
    actions = device.getStoreValue('config').callbacks;
  }

  const result: ShellyActionEventArgument[] = actions
    .map((action, idx) => ({
      id: idx,
      name: eventLabels[action],
      action,
    }));

  result.unshift({
    id: 999,
    name: homey.__('util.any_action'),
  });

  return result;
}

const NA = 'n/a';
export function convertIncomingActionEvent(
  code: string,
  communication: keyof typeof eventMap,
  gen?: keyof typeof eventMap['cloud']): string {
  try {
    if (communication === 'cloud') {
      if (!gen) {
        return NA;
      }

      return eventMap['cloud'][gen][code] ?? NA;
    }

    return eventMap[communication][code] ?? NA;
  } catch (e) {
    // Just catch
  }

  return NA;
}
