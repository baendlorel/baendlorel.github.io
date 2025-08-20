export const enum Persis {
  ExpireDays = 1,
  ExpireHour = 3,

  /**
   * Compressed value
   */
  Prefix = 'kskbtumugi:value:',

  /**
   * Expiration time of the value
   */
  ExpirePrefix = 'kskbtumugi:expire:',

  /**
   * Value type, determines the deserialize method
   */
  Type = 'kskbtumugi:type:',
}
