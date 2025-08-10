export const ICON_PATH = {
  MESSAGE: '/images/UI/notification_1.svg',
  MESSAGE_ALT: '/images/UI/Notifications.png',
  TREE: '/images/UI/TreeIcon.png',
  TREE_WITH_MESSAGE: '/images/UI/TreeIconWithNewMessage.png',
  SETTINGS: '/images/UI/Setting.png',
  ORNAMENT: '/images/tree/ornament.svg',
  DECORATIONS: {
    DECOR_01: '/images/decorations/Decor-01.png',
    DECOR_02: '/images/decorations/Decor-02.png',
    DECOR_03: '/images/decorations/Decor-03.png',
    DECOR_04: '/images/decorations/Decor-04.png',
    DECOR_05: '/images/decorations/Decor-05.png',
    DECOR_06: '/images/decorations/Decor-06.png',
    DECOR_07: '/images/decorations/Decor-07.png',
    DECOR_08: '/images/decorations/Decor-08.png',
    DECOR_09: '/images/decorations/Decor-09.png',
    DECOR_10: '/images/decorations/Decor-10.png',
  },
  BACKGROUNDS: {
    AUTH_BG: '/images/bg/auth_bg.png',
  },
  TREES: {
    CHRISTMAS_TREE: '/images/trees/ChristmasTree.png',
    TREE_1: '/images/trees/tree_1.png',
  },
} as const;

export type IconPathKey = keyof typeof ICON_PATH;
export type DecorationKey = keyof typeof ICON_PATH.DECORATIONS;
