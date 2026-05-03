#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WeatherWidgetBridge, NSObject)

RCT_EXTERN_METHOD(setWidgetData:(nonnull NSNumber *)temperature
                  weatherCode:(nonnull NSNumber *)weatherCode
                  city:(NSString *)city)

@end
