import { NativeModules } from 'react-native';

const { yamap } = NativeModules;

export interface YaMapInterface {
  init(apiKey: string): Promise<void>;
  setLocale(locale: string): Promise<void>;
  getLocale(): Promise<string>;
  resetLocale(): Promise<void>;
}

export const NativeYamapModule = yamap as YaMapInterface;

export class YamapInstance {
  public static init(apiKey: string): Promise<void> {
    return NativeYamapModule.init(apiKey);
  }

  public static setLocale(locale: string): Promise<void> {
    return NativeYamapModule.setLocale(locale);
  }

  public static getLocale(): Promise<string> {
    return NativeYamapModule.getLocale();
  }

  public static resetLocale(): Promise<void> {
    return NativeYamapModule.resetLocale();
  }
}
