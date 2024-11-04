import React from 'react';
import { Platform } from 'react-native';
import { debug } from './constants';

let ACFTBannerAd;

if (debug) {
  ACFTBannerAd = () => {
    return <></>;
  };
} else {
  const { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');

  ACFTBannerAd = () => {
    const unitID = Platform.select({
      ios: "ca-app-pub-3407478259803394/2116145800",
      android: "ca-app-pub-3407478259803394/2138582137",
    });

    return (
      <BannerAd
        unitId={unitID}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    );
  };
}

export default ACFTBannerAd;
