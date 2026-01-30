import { EquipmentItem } from '../types';

export const equipmentData: EquipmentItem[] = [
    // --- CAMERAS (Existing List) ---
    // ARRI
    {
        id: 'cam-arri-35',
        name: 'ARRI Alexa 35',
        brand: 'ARRI',
        model: 'ALEXA 35',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: '17 Stop Dynamic Range. "Open Gate" mode is reference in lens tests.',
        specs: {
            mount: 'LPL',
            sensor_size: '27.99 x 19.22',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4.6K',
            recording_formats: [
                { resolution: '4.6K (4608 x 3164)', codec: 'ARRIRAW', max_fps: '75 fps', data_rate: '2.6 Gbps' },
                { resolution: '4.6K (4608 x 3164)', codec: 'ProRes 4444 XQ', max_fps: '60 fps', data_rate: '1.8 Gbps' },
                { resolution: '4K 16:9 (4096 x 2304)', codec: 'ProRes 422 HQ', max_fps: '120 fps', data_rate: '800 Mbps' },
                { resolution: '3.3K 6:5 (3328 x 2790)', codec: 'ARRIRAW', max_fps: '100 fps', data_rate: '1.9 Gbps' }
            ]
        },
        daily_rate_est: 1500,
        image_url: '/equipment/alexa_35.png',
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'Super 35 format ARRI ALEV 4 CMOS sensor with Bayer pattern color filter array' },
                    { label: 'Sensor Maximum Number of Photosites and Size', value: '4608 x 3164 | 27.99 x 19.22 mm / 1.102 x 0.757" | Ø 33.96 mm / 1.337"' },
                    { label: 'Photosite Pitch', value: '6.075 μm' },
                    { label: 'Dynamic Range', value: '17 stops' }
                ]
            },
            {
                title: 'Recording',
                items: [
                    { label: 'Recording Media', value: 'Codex Compact Drive 1TB / 2TB' },
                    { label: 'Recording Formats', value: 'MXF/ARRIRAW, MXF/Apple ProRes 4444 XQ, MXF/Apple ProRes 4444, MXF/Apple ProRes 422 HQ' },
                    { label: 'Recording Modes', value: 'Standard real-time recording, Pre-recording' }
                ]
            },
            {
                title: 'Power',
                items: [
                    { label: 'Power Input', value: '1x PWR (LEMO 8-pin) | 20.5 - 33.6 V DC' },
                    { label: 'Power Consumption', value: '~ 90 W (Camera body and MVF-2)' },
                    { label: 'Power Outputs', value: '1x RS (24V), 1x 12V (LEMO 2-pin), 1x LBUS (24V), 1x ETH (24V)' }
                ]
            },
            {
                title: 'Connectors & Interfaces',
                items: [
                    { label: 'Lens Mounts', value: 'ARRI LPL Mount (LBUS), PL-to-LPL Adapter' },
                    { label: 'Flange Focal Depth', value: 'LPL mount: 44 mm, PL mount: 52 mm' },
                    { label: 'Video Outputs', value: '2x 12G SDI (BNC)' },
                    { label: 'Audio Inputs', value: '1x LEMO 6pin balanced stereo line in' },
                    { label: 'Other Interfaces', value: '1x LBUS, 1x SERIAL, 1x TC (In/Out), 1x ETH, 1x SYNC IN, 1x USB-C' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'Weight', value: '∼2.9 kg / 6.4 lbs (body + LPL mount)' },
                    { label: 'Dimensions', value: '147 x 152.5 x 203 mm / 5.8 x 6.0 x 8.0"' },
                    { label: 'Operating Temp', value: '-20° C to +45° C / -4° F to +113° F' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 15.3, snr_1: 16.3 },
            rolling_shutter_ms: 8.0,
            base_iso: 800,
            latitude_stops: 14.5,
            source_url: 'https://www.cined.com/arri-alexa-35-dynamic-range-latitude-and-rolling-shutter-lab-test-in-arriraw-4-6k'
        }
    },
    {
        id: 'cam-arri-35-xtreme',
        name: 'ARRI Alexa 35 Xtreme',
        brand: 'ARRI',
        model: 'ALEXA 35 Xtreme',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'New High Speed variant. Up to 330 fps in 4.6K and 660 fps in 2K. Supports ARRICORE codec.',
        specs: {
            mount: 'LPL',
            sensor_size: '27.99 x 19.22',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4.6K',
            recording_formats: [
                { resolution: '2K S16 (2048 x 1152)', codec: 'ARRICORE', max_fps: '660 fps', data_rate: 'High Speed' },
                { resolution: '4.6K (4608 x 3164)', codec: 'ARRICORE', max_fps: '330 fps', data_rate: 'High Speed' },
                { resolution: '4.6K (4608 x 3164)', codec: 'ARRIRAW', max_fps: '120 fps', data_rate: '2.6 Gbps' }
            ]
        },
        daily_rate_est: 2500,
        image_url: '/equipment/alexa_35.png', // Shares body style
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'Super 35 format ARRI ALEV 4 CMOS sensor' },
                    { label: 'Dynamic Range', value: '17 stops (Maintained up to 330 fps)' }
                ]
            },
            {
                title: 'High Speed Performance',
                items: [
                    { label: 'Max Frame Rate', value: '660 fps (2K S16 with Sensor Overdrive)' },
                    { label: 'Standard High Speed', value: '330 fps (4.6K Full Sensor)' },
                    { label: 'Pre-Recording', value: 'Up to 5 minutes (Extended Buffer)' }
                ]
            },
            {
                title: 'Recording',
                items: [
                    { label: 'New Codec', value: 'ARRICORE (Efficient High Speed RGB)' },
                    { label: 'Media', value: 'Codex Compact Drive 1TB / 2TB' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://www.arri.com/en/camera-systems/cameras/alexa-35-xtreme' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 15.3, snr_1: 16.3 },
            rolling_shutter_ms: 8.0,
            base_iso: 800,
            latitude_stops: 14.5,
            source_url: 'https://www.cined.com/arri-alexa-35-lab-test'
        }
    },
    {
        id: 'cam-arri-mini-lf',
        name: 'ARRI Alexa Mini LF',
        brand: 'ARRI',
        model: 'ALEXA Mini LF',
        category: 'Camera',
        subcategory: 'Cinema Large Format',
        description: 'Large Format. Slightly larger than Full Frame. May vignette on standard FF lenses.',
        specs: {
            mount: 'LPL',
            sensor_size: '36.70 x 25.54',
            sensor_type: 'Large Format', sensor_coverage: 'LF' as const,
            resolution: '4.5K',
            recording_formats: [
                { resolution: '4.5K OG (4448 x 3096)', codec: 'ARRIRAW', max_fps: '40 fps', data_rate: '2.2 Gbps' },
                { resolution: '4.5K OG (4448 x 3096)', codec: 'ProRes 4444 XQ', max_fps: '40 fps', data_rate: '1.4 Gbps' },
                { resolution: 'UHD (3840 x 2160)', codec: 'ProRes 422 HQ', max_fps: '60 fps', data_rate: '880 Mbps' }
            ]
        },
        daily_rate_est: 1200,

        image_url: '/equipment/alexa_mini_lf.png',
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'Large Format ARRI ALEV III (A2X) CMOS' },
                    { label: 'Sensor Size', value: '36.70 x 25.54 mm (Diagonal: 44.71 mm)' },
                    { label: 'Pixel Count', value: '4448 x 3096 (13.7 MP)' },
                    { label: 'Dynamic Range', value: '14+ Stops (Claimed)' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Rolling Shutter (4.5K OG)', value: '7.4 ms (Excellent)' },
                    { label: 'Dynamic Range (ISO 800)', value: '13.5 stops (SNR=2), 14.7 stops (SNR=1)' },
                    { label: 'Latitude', value: '8-9 Standard Stops' }
                ]
            },
            {
                title: 'Recording',
                items: [
                    { label: 'Recording Media', value: 'Codex Compact Drive 1TB / 2TB' },
                    { label: 'Codecs', value: 'MXF/ARRIRAW, MXF/Apple ProRes 4444 XQ' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://www.arri.com/en/camera-systems/cameras/alexa-mini-lf/downloads' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 13.5, snr_1: 14.7 },
            rolling_shutter_ms: 7.4,
            base_iso: 800,
            latitude_stops: 8.5,
            source_url: 'https://www.cined.com/arri-alexa-mini-lf-lab-test-rolling-shutter-dynamic-range-and-latitude/'
        }
    },
    {
        id: 'cam-arri-lf',
        name: 'ARRI Alexa LF',
        brand: 'ARRI',
        model: 'ALEXA LF',
        category: 'Camera',
        subcategory: 'Cinema Large Format',
        description: 'Same sensor as Mini LF, larger body for high FPS.',
        specs: {
            mount: 'LPL',
            sensor_size: '36.70 x 25.54',
            sensor_type: 'Large Format', sensor_coverage: 'LF' as const,
            resolution: '4.5K',
            recording_formats: [
                { resolution: '4.5K OG (4448 x 3096)', codec: 'ARRIRAW', max_fps: '150 fps', data_rate: '2.5 Gbps' },
                { resolution: 'ProRes 4444 XQ', codec: 'ProRes', max_fps: '60 fps', data_rate: '1.4 Gbps' }
            ]
        },
        daily_rate_est: 1100
    },
    {
        id: 'cam-arri-mini',
        name: 'ARRI Alexa Mini',
        brand: 'ARRI',
        model: 'ALEXA Mini',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'Industry workhorse. 4K UHD upscaled.',
        specs: {
            mount: 'PL',
            sensor_size: '28.17 x 18.13',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '3.4K',
            recording_formats: [
                { resolution: '3.4K OG (3424 x 2202)', codec: 'ARRIRAW', max_fps: '30 fps', data_rate: '1.2 Gbps' },
                { resolution: '3.2K (3200 x 1800)', codec: 'ProRes 4444 XQ', max_fps: '60 fps', data_rate: '800 Mbps' },
                { resolution: 'HD (1920 x 1080)', codec: 'ProRes 422', max_fps: '200 fps', data_rate: '250 Mbps' }
            ]
        },
        daily_rate_est: 800
    },
    {
        id: 'cam-arri-amira',
        name: 'ARRI Amira Live',
        brand: 'ARRI',
        model: 'AMIRA / Live',
        category: 'Camera',
        subcategory: 'Broadcast / Doc',
        description: 'Documentary/TV focused. Sensor same as Mini.',
        specs: {
            mount: 'PL',
            sensor_size: '28.17 x 18.13',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4K UHD',
            recording_formats: [
                { resolution: '4K UHD (3840 x 2160)', codec: 'ProRes 4444', max_fps: '60 fps', data_rate: '700 Mbps' },
                { resolution: '3.2K (3200 x 1800)', codec: 'ARRIRAW (T-Link)', max_fps: '60 fps', data_rate: 'External' }
            ]
        },
        daily_rate_est: 700
    },
    {
        id: 'cam-arri-65',
        name: 'ARRI Alexa 65',
        brand: 'ARRI',
        model: 'ALEXA 65',
        category: 'Camera',
        subcategory: 'Cinema Medium Format',
        description: 'Rental only from ARRI. Requires XPL lenses.',
        specs: {
            mount: 'XPL',
            sensor_size: '54.12 x 25.58',
            sensor_type: '65mm (Medium)', sensor_coverage: 'LF' as const,
            resolution: '6.5K',
            recording_formats: [
                { resolution: '6.5K OG (6560 x 3100)', codec: 'ARRIRAW', max_fps: '27 fps', data_rate: '3.2 Gbps' },
                { resolution: '5K 16:9', codec: 'ARRIRAW', max_fps: '60 fps', data_rate: '2.8 Gbps' }
            ]
        },
        daily_rate_est: 350,
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'Super 35mm DGO Sensor (RF Mount)' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Dynamic Range', value: '12.8 stops (DGO On)' },
                    { label: 'Rolling Shutter', value: '~15 ms (Passable)' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://www.usa.canon.com/support/p/eos-c70' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 12.8, snr_1: 13.9 },
            rolling_shutter_ms: 15.0,
            base_iso: 800,
            latitude_stops: 12,
            source_url: 'https://www.cined.com/canon-c70-lab-test-dynamic-range-latitude-and-rolling-shutter/'
        }
    },
    // SONY
    {
        id: 'cam-sony-venice-2-8k',
        name: 'Sony Venice 2 (8K)',
        brand: 'SONY',
        model: 'VENICE 2 (8K)',
        category: 'Camera',
        subcategory: 'Cinema Full Frame',
        description: 'Switchable sensor block. E-Mount under PL.',
        specs: {
            mount: 'PL',
            sensor_size: '35.90 x 24.00',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '8.6K',
            recording_formats: [
                { resolution: '8.6K 3:2 (8640 x 5760)', codec: 'X-OCN XT', max_fps: '30 fps', data_rate: '2.4 Gbps' },
                { resolution: '8.2K 17:9 (8192 x 4320)', codec: 'X-OCN ST', max_fps: '60 fps', data_rate: '1.8 Gbps' },
                { resolution: '5.8K 6:5 Anamorphic', codec: 'X-OCN LT', max_fps: '48 fps', data_rate: '900 Mbps' },
                { resolution: '4K ProRes', codec: 'ProRes 422 HQ', max_fps: '60 fps', data_rate: '1.2 Gbps' }
            ]
        },
        daily_rate_est: 1300,
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'Full-Frame 8.6K CMOS' },
                    { label: 'Dynamic Range', value: '16 Stops (Claimed), 14.2 Stops Lab (SNR=1)' },
                    { label: 'Dual Base ISO', value: '800 / 3200' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Rolling Shutter (8K 3:2)', value: '3.9 ms (Fastest in Class)' },
                    { label: 'Rolling Shutter (8K 17:9)', value: '4.0 ms' },
                    { label: 'Dynamic Range (ISO 3200)', value: '11.7 stops (SNR=2), 12.9 stops (SNR=1)' }
                ]
            },
            {
                title: 'Records To',
                items: [
                    { label: 'AXS Memory', value: 'AXS-A1TS66 1TB (6.6 Gbps) high speed cards' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://pro.sony/ue_US/support-resources/venice2/manual' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 13.2, snr_1: 14.2 },
            rolling_shutter_ms: 3.9,
            base_iso: 800,
            latitude_stops: 13,
            source_url: 'https://www.cined.com/sony-venice-2-lab-test-dynamic-range-latitude-and-rolling-shutter/'
        }
    },
    {
        id: 'cam-sony-venice-2-6k',
        name: 'Sony Venice 2 (6K)',
        brand: 'SONY',
        model: 'VENICE 2 (6K)',
        category: 'Camera',
        subcategory: 'Cinema Full Frame',
        description: 'Slightly wider sensor than 8K version.',
        specs: {
            mount: 'PL',
            sensor_size: '36.20 x 24.10',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '6K',
            recording_formats: [
                { resolution: '6K 3:2 (6048 x 4032)', codec: 'X-OCN XT', max_fps: '30 fps', data_rate: '2 Gbps' },
                { resolution: '4K Anamorphic', codec: 'X-OCN ST', max_fps: '60 fps', data_rate: '1 Gbps' }
            ]
        },
        daily_rate_est: 1100
    },
    {
        id: 'cam-sony-venice-1',
        name: 'Sony Venice',
        brand: 'SONY',
        model: 'VENICE (1)',
        category: 'Camera',
        subcategory: 'Cinema Full Frame',
        description: 'First gen. Check Rialto compatibility.',
        specs: {
            mount: 'PL',
            sensor_size: '36.20 x 24.10',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '6K',
            recording_formats: [
                { resolution: '6K 3:2', codec: 'X-OCN XT (AXS-R7)', max_fps: '30 fps', data_rate: 'External' },
                { resolution: '4K XAVC', codec: 'XAVC Class 480', max_fps: '60 fps', data_rate: '960 Mbps' }
            ]
        },
        daily_rate_est: 900
    },
    {
        id: 'cam-sony-burano',
        name: 'Sony Burano',
        brand: 'SONY',
        model: 'BURANO',
        category: 'Camera',
        subcategory: 'Cinema Full Frame',
        description: 'Internal IBIS with PL mount.',
        specs: {
            mount: 'PL',
            sensor_size: '35.90 x 24.00',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '8.6K',
            recording_formats: [
                { resolution: '8.6K 16:9', codec: 'X-OCN LT', max_fps: '30 fps', data_rate: '1.2 Gbps' },
                { resolution: '8K 16:9', codec: 'XAVC H-I', max_fps: '30 fps', data_rate: '1.2 Gbps' }
            ]
        },
        daily_rate_est: 800,
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: '35mm full frame (36 x 24mm) CMOS image sensor' },
                    { label: 'Pixel Count', value: '8.6K: 8640 x 5760 (49.7MP)' },
                    { label: 'Dynamic Range', value: '16 stops (Claimed), ~13 Stops Lab (SNR=1)' },
                    { label: 'Dual Base ISO', value: 'ISO 800 / ISO 3200' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Rolling Shutter (8K 3:2)', value: '17-18ms (Noticeably Slower than Venice 2)' },
                    { label: 'Rolling Shutter (4K Crop)', value: '8.5ms - 12.6ms' },
                    { label: 'Dynamic Range (ISO 800)', value: '12.2 stops (SNR=2), 12.9 stops (SNR=1)' }
                ]
            },
            {
                title: 'Recording',
                items: [
                    { label: 'Recording Media', value: 'CFexpress Type B' },
                    { label: 'Recording Formats', value: 'X-OCN LT (No ST/XT), XAVC H, XAVC-I' }
                ]
            },
            {
                title: 'Key Features',
                items: [
                    { label: 'IBIS', value: 'In-Body Image Stabilization (First in PL Cinema Camera)' },
                    { label: 'ND Filters', value: 'Variable ND (0.6 to 2.1)' },
                    { label: 'Auto Focus', value: 'Fast Hybrid AF (Phase-detection / Contrast-detection)' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://pro.sony/ue_US/support-resources/burano/manual' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 12.2, snr_1: 12.9 },
            rolling_shutter_ms: 17.5,
            base_iso: 800,
            latitude_stops: 11,
            source_url: 'https://www.cined.com/sony-burano-lab-test-rolling-shutter-dynamic-range-and-latitude/'
        }
    },
    {
        id: 'cam-sony-fx9',
        name: 'Sony FX9',
        brand: 'SONY',
        model: 'FX9',
        category: 'Camera',
        subcategory: 'Documentary',
        description: '6K sensor, 4K recording. Locking E-Mount.',
        specs: {
            mount: 'E-Mount',
            sensor_size: '35.70 x 18.80',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '6K',
            recording_formats: [
                { resolution: '4K DCI (4096 x 2160)', codec: 'XAVC-I', max_fps: '60 fps', data_rate: '600 Mbps' },
                { resolution: 'UHD (3840 x 2160)', codec: 'XAVC-L', max_fps: '60 fps', data_rate: '150 Mbps' },
                { resolution: 'HD', codec: 'MPEG HD422', max_fps: '120 fps', data_rate: '50 Mbps' }
            ]
        },
        daily_rate_est: 400
    },
    {
        id: 'cam-sony-fx6',
        name: 'Sony FX6',
        brand: 'SONY',
        model: 'FX6',
        category: 'Camera',
        subcategory: 'Documentary',
        description: 'High Base ISO 12800. Low light beast.',
        specs: {
            mount: 'E-Mount',
            sensor_size: '35.70 x 18.80',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '4.2K',
            recording_formats: [
                { resolution: '4K DCI', codec: 'XAVC-I', max_fps: '120 fps', data_rate: '600 Mbps' },
                { resolution: 'UHD', codec: 'XAVC-L', max_fps: '120 fps', data_rate: '150 Mbps' }
            ]
        },
        daily_rate_est: 300,
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: '12K Super 35 Sensor' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Dynamic Range', value: '13.6 stops (12K)' },
                    { label: 'Rolling Shutter', value: '5.5 ms (8K) - 12 ms (12K)' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://www.blackmagicdesign.com/support/family/professional-cameras' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 12.6, snr_1: 13.6 },
            rolling_shutter_ms: 12.0,
            base_iso: 800,
            latitude_stops: 12,
            source_url: 'https://www.cined.com/blackmagic-ursa-mini-pro-12k-lab-test-dynamic-range-and-rolling-shutter/'
        },
        image_url: '/equipment/fx6.png'
    },
    {
        id: 'cam-sony-fx3',
        name: 'Sony FX3',
        brand: 'SONY',
        model: 'FX3',
        category: 'Camera',
        subcategory: 'Mirrorless Cinema',
        description: 'Compact Full Frame. Do not confuse with FX30 (APS-C).',
        specs: {
            mount: 'E-Mount',
            sensor_size: '35.60 x 23.80',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '4.2K',
            recording_formats: [
                { resolution: 'UHD 4K', codec: 'XAVC S-I', max_fps: '120 fps', data_rate: '600 Mbps' },
                { resolution: 'UHD 4K', codec: 'XAVC HS', max_fps: '120 fps', data_rate: '200 Mbps' }
            ]
        },
        daily_rate_est: 200,
        image_url: '/equipment/fx3.png'
    },
    // RED
    {
        id: 'cam-red-raptor-x',
        name: 'RED V-Raptor [X]',
        brand: 'RED',
        model: 'V-RAPTOR [X] 8K',
        category: 'Camera',
        subcategory: 'Cinema Vista Vision',
        description: 'Global Shutter VV. Phantom track feature.',
        specs: {
            mount: 'RF',
            sensor_size: '40.96 x 21.60',
            sensor_type: 'Vista Vision', sensor_coverage: 'LF' as const,
            resolution: '8K',
            recording_formats: [
                { resolution: '8K VV (8192 x 4320)', codec: 'REDCODE RAW HQ', max_fps: '120 fps', data_rate: '2.5 Gbps' },
                { resolution: '6K S35 (6144 x 3240)', codec: 'REDCODE RAW MQ', max_fps: '160 fps', data_rate: '1.5 Gbps' },
                { resolution: '4K (4096 x 2160)', codec: 'ProRes 422 HQ', max_fps: '60 fps', data_rate: '800 Mbps' }
            ]
        },
        daily_rate_est: 1000,
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'V-RAPTOR [X] 8K VV Global Shutter CMOS' },
                    { label: 'Dynamic Range', value: '17+ stops (Claimed)' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Rolling Shutter', value: '0 ms (Global Shutter)' },
                    { label: 'Dynamic Range', value: '13.4 stops (SNR=2) - Improved Highlights' }
                ]
            },
            {
                title: 'Recording',
                items: [
                    { label: 'Recording Media', value: 'CFexpress Type B' },
                    { label: 'Max Data Rate', value: 'Up to 800 MB/s using RED branded cards' },
                    { label: 'Redcode Options', value: 'HQ, MQ, LQ (simplified)' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'Weight', value: '4.03 lbs / 1.8 kg (Body Only)' },
                    { label: 'Construction', value: 'Aluminum Alloy' }
                ]
            },
            {
                title: 'Connectors',
                items: [
                    { label: 'Lens Mount', value: 'Locking RF Mount (supports Canon RF lenses electrically)' },
                    { label: 'Video Outputs', value: '2x 12G-SDI' },
                    { label: 'Audio', value: 'Integrated dual channel digital mono microphones, uncompressed, 24-bit 48 kHz' },
                    { label: 'Remote', value: '9-pin EXT port (Genlock, TC, GPIO, R/S)' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://docs.red.com/955-0219_v1.7/REV_A/HTML/' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 13.4, snr_1: 14.5 },
            rolling_shutter_ms: 0,
            base_iso: 800,
            latitude_stops: 13,
            source_url: 'https://www.cined.com/red-v-raptor-x-lab-test-rolling-shutter-dynamic-range-and-latitude/'
        },
        image_url: '/equipment/v_raptor.png'
    },
    {
        id: 'cam-red-vraptor-8k',
        name: 'RED V-Raptor 8K VV',
        brand: 'RED',
        model: 'V-RAPTOR 8K VV',
        category: 'Camera',
        subcategory: 'Cinema Vista Vision',
        description: 'Multi-format 8K Vista Vision sensor. Capable of 8K 120fps.',
        specs: {
            mount: 'RF',
            sensor_size: '40.96 x 21.60',
            sensor_type: 'Vista Vision', sensor_coverage: 'LF' as const,
            resolution: '8K',
            recording_formats: [
                { resolution: '8K VV', codec: 'REDCODE RAW HQ', max_fps: '120 fps', data_rate: '2.5 Gbps' },
                { resolution: '4K', codec: 'ProRes 422 HQ', max_fps: '60 fps', data_rate: '700 Mbps' }
            ]
        },
        daily_rate_est: 950,
        // Official RED V-Raptor Image (Temporary removed)
        // image_url: '/equipment/red_vraptor.png',
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: '35.4MP Vista Vision CMOS' },
                    { label: 'Dynamic Range', value: '17+ Stops (Claimed), 15.1 Stops Lab (SNR=1)' },
                    { label: 'Max Data Rate', value: '800 MB/s (using RED PRO CFexpress)' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Rolling Shutter (8K FF)', value: '8.0 ms (Excellent)' },
                    { label: 'Rolling Shutter (6K S35)', value: '6.0 ms' },
                    { label: 'Dynamic Range (ISO 800)', value: '13.7 stops (SNR=2), 15.1 stops (SNR=1)' }
                ]
            },
            {
                title: 'Power & Ports',
                items: [
                    { label: 'Battery', value: 'Integrated V-Lock interface (Micro V-Lock)' },
                    { label: 'Outputs', value: '2x 12G-SDI, USB-C, 5-pin Audio' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://docs.red.com/955-0195_v1.0/Rev_E/HTML/Content/1_Intro/Welcome.htm' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 13.7, snr_1: 15.1 },
            rolling_shutter_ms: 8.0,
            base_iso: 800,
            latitude_stops: 13, // Standard without highlight recovery
            source_url: 'https://www.cined.com/red-v-raptor-8k-vv-lab-test-rolling-shutter-dynamic-range-and-latitude/'
        }
    },
    {
        id: 'cam-red-komodo-x',
        name: 'RED Komodo-X',
        brand: 'RED',
        model: 'KOMODO-X',
        category: 'Camera',
        subcategory: 'Cinema S35',
        description: 'Global Shutter. Faster frame rates than OG Komodo.',
        specs: {
            mount: 'RF',
            sensor_size: '27.03 x 14.25',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '6K',
            recording_formats: [
                { resolution: '6K 17:9', codec: 'REDCODE RAW HQ', max_fps: '80 fps', data_rate: '1.2 Gbps' },
                { resolution: '4K 17:9', codec: 'REDCODE RAW MQ', max_fps: '120 fps', data_rate: '800 Mbps' }
            ]
        },
        daily_rate_est: 500
    },
    {
        id: 'cam-red-komodo',
        name: 'RED Komodo',
        brand: 'RED',
        model: 'KOMODO',
        category: 'Camera',
        subcategory: 'Crash Cam',
        description: 'Global Shutter entry level cinema.',
        specs: {
            mount: 'RF',
            sensor_size: '27.03 x 14.25',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '6K',
            recording_formats: [
                { resolution: '6K 17:9', codec: 'REDCODE RAW HQ', max_fps: '40 fps', data_rate: '1 Gbps' },
                { resolution: '2K', codec: 'ProRes 422', max_fps: '60 fps', data_rate: '200 Mbps' }
            ]
        },
        daily_rate_est: 350
    },
    {
        id: 'cam-red-monstro',
        name: 'RED Monstro 8K VV',
        brand: 'RED',
        model: 'MONSTRO 8K VV',
        category: 'Camera',
        subcategory: 'Cinema Vista Vision',
        description: 'DSMC2 Body. Still very popular high res camera.',
        specs: {
            mount: 'PL',
            sensor_size: '40.96 x 21.60',
            sensor_type: 'Vista Vision', sensor_coverage: 'LF' as const,
            resolution: '8K',
            recording_formats: [
                { resolution: '8K VV', codec: 'REDCODE RAW 5:1', max_fps: '60 fps', data_rate: '1.5 Gbps' },
                { resolution: '4K ProRes', codec: 'ProRes 422 HQ', max_fps: '30 fps', data_rate: '600 Mbps' }
            ]
        },
        daily_rate_est: 850
    },
    {
        id: 'cam-red-helium',
        name: 'RED Helium 8K S35',
        brand: 'RED',
        model: 'HELIUM 8K S35',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'Highest resolution S35 sensor.',
        specs: {
            mount: 'PL',
            sensor_size: '29.90 x 15.77',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '8K',
            recording_formats: [
                { resolution: '8K Full', codec: 'REDCODE RAW 5:1', max_fps: '60 fps', data_rate: '1.4 Gbps' },
                { resolution: '4K', codec: 'REDCODE RAW 2:1', max_fps: '120 fps', data_rate: '1 Gbps' }
            ]
        },
        daily_rate_est: 700
    },
    {
        id: 'cam-red-gemini',
        name: 'RED Gemini 5K',
        brand: 'RED',
        model: 'GEMINI 5K S35',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'Dual Sensitivity low light sensor. Taller sensor.',
        specs: {
            mount: 'PL',
            sensor_size: '30.72 x 18.00',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '5K',
            recording_formats: [
                { resolution: '5K Full', codec: 'REDCODE RAW 3:1', max_fps: '96 fps', data_rate: '1.2 Gbps' },
                { resolution: '4K', codec: 'ProRes 422 HQ', max_fps: '30 fps', data_rate: '700 Mbps' }
            ]
        },
        daily_rate_est: 600
    },
    // CANON
    {
        id: 'cam-canon-c500ii',
        name: 'Canon C500 Mk II',
        brand: 'CANON',
        model: 'EOS C500 Mk II',
        category: 'Camera',
        subcategory: 'Cinema Full Frame',
        description: 'Modular body. 17:9 aspect ratio sensor.',
        specs: {
            mount: 'EF',
            sensor_size: '38.10 x 20.10',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '5.9K',
            recording_formats: [
                { resolution: '5.9K Raw', codec: 'Cinema RAW Light', max_fps: '60 fps', data_rate: '2.1 Gbps' },
                { resolution: '4K', codec: 'XF-AVC', max_fps: '60 fps', data_rate: '810 Mbps' }
            ]
        },
        daily_rate_est: 650,
        image_url: '/equipment/canon_c500.png'
    },
    {
        id: 'cam-canon-c300iii',
        name: 'Canon C300 Mk III',
        brand: 'CANON',
        model: 'EOS C300 Mk III',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'DGO Sensor. 16+ stops dynamic range.',
        specs: {
            mount: 'EF',
            sensor_size: '26.20 x 13.80',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4K',
            recording_formats: [
                { resolution: '4K DCI', codec: 'Cinema RAW Light', max_fps: '120 fps', data_rate: '1 Gbps' },
                { resolution: '4K UHD', codec: 'XF-AVC', max_fps: '120 fps', data_rate: '800 Mbps' }
            ]
        },
        daily_rate_est: 550
    },
    {
        id: 'cam-canon-c70',
        name: 'Canon C70',
        brand: 'CANON',
        model: 'EOS C70',
        category: 'Camera',
        subcategory: 'Mirrorless Cinema',
        description: 'DGO sensor in a mirrorless body. RF mount.',
        specs: {
            mount: 'RF',
            sensor_size: '26.20 x 13.80',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4K',
            recording_formats: [
                { resolution: '4K DCI', codec: 'XF-AVC Intra', max_fps: '120 fps', data_rate: '410 Mbps' },
                { resolution: '4K UHD', codec: 'XF-AVC Long GOP', max_fps: '120 fps', data_rate: '150 Mbps' }
            ]
        },
        daily_rate_est: 300,
        image_url: '/equipment/canon_c70.png',
        lab_metrics: {
            dynamic_range_stops: { snr_2: 12.8, snr_1: 14.1 },
            rolling_shutter_ms: 15.6,
            base_iso: 800,
            latitude_stops: 12.3,
            source_url: 'https://www.cined.com/canon-c70-lab-test-dynamic-range-latitude-and-rolling-shutter/'
        }
    },
    // BLACKMAGIC
    {
        id: 'cam-bmd-12k',
        name: 'URSA Mini Pro 12K',
        brand: 'BLACKMAGIC',
        model: 'URSA Mini Pro 12K',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'Massive pixel density. Needs sharpest S35 lenses.',
        specs: {
            mount: 'PL',
            sensor_size: '27.03 x 14.25',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '12K',
            recording_formats: [
                { resolution: '12K (12288 x 6480)', codec: 'BRAW 8:1', max_fps: '60 fps', data_rate: '1.5 Gbps' },
                { resolution: '8K', codec: 'BRAW', max_fps: '120 fps', data_rate: '900 Mbps' },
                { resolution: '4K S16', codec: 'BRAW', max_fps: '240 fps', data_rate: '400 Mbps' }
            ]
        },
        daily_rate_est: 500
    },
    {
        id: 'cam-bmd-p6k-pro',
        name: 'Pocket 6K Pro',
        brand: 'BLACKMAGIC',
        model: 'Pocket 6K Pro',
        category: 'Camera',
        subcategory: 'Cinema Compact',
        description: 'EF Mount limits adaptation options.',
        specs: {
            mount: 'EF',
            sensor_size: '23.10 x 12.99',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '6K',
            recording_formats: [
                { resolution: '6K (6144 x 3456)', codec: 'BRAW 5:1', max_fps: '50 fps', data_rate: '480 Mbps' },
                { resolution: '2.8K', codec: 'ProRes 422', max_fps: '120 fps', data_rate: '300 Mbps' }
            ]
        },
        daily_rate_est: 150
    },
    // PANASONIC
    {
        id: 'cam-pan-varicam-35',
        name: 'Panasonic VariCam 35',
        brand: 'PANASONIC',
        model: 'VariCam 35',
        category: 'Camera',
        subcategory: 'Cinema Super 35',
        description: 'Pioneered Dual Native ISO. Beloved color science.',
        specs: {
            mount: 'PL',
            sensor_size: '24.60 x 12.97',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4K',
            recording_formats: [
                { resolution: '4K DCI', codec: 'AVC-Intra 4K', max_fps: '120 fps', data_rate: '800 Mbps' },
                { resolution: '2K', codec: 'AVC-Intra 2K', max_fps: '240 fps', data_rate: '400 Mbps' }
            ]
        },
        daily_rate_est: 900
    },
    // PHANTOM
    {
        id: 'cam-phantom-flex4k',
        name: 'Phantom Flex4K',
        brand: 'PHANTOM',
        model: 'Flex4K',
        category: 'Camera',
        subcategory: 'High Speed',
        description: '1000 FPS @ 4K. The slow motion standard.',
        specs: {
            mount: 'PL',
            sensor_size: '27.60 x 15.50',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4K',
            recording_formats: [
                { resolution: '4K (4096 x 2304)', codec: 'Cine Raw (12-bit)', max_fps: '1000 fps', data_rate: '45 GB/s' },
                { resolution: '2K (2048 x 1536)', codec: 'Cine Raw', max_fps: '2000 fps', data_rate: '40 GB/s' }
            ]
        },
        daily_rate_est: 2500,
        image_url: '/equipment/phantom_flex.png'
    },
    {
        id: 'cam-phantom-veo',
        name: 'Phantom VEO 4K',
        brand: 'PHANTOM',
        model: 'VEO 4K',
        category: 'Camera',
        subcategory: 'High Speed',
        description: 'Compact version of Flex4K.',
        specs: {
            mount: 'PL',
            sensor_size: '27.60 x 15.50',
            sensor_type: 'Super 35', sensor_coverage: 'S35' as const,
            resolution: '4K',
            recording_formats: [
                { resolution: '4K (4096 x 2304)', codec: 'Cine Raw (12-bit)', max_fps: '1000 fps', data_rate: '45 GB/s' },
                { resolution: '2K (2048 x 1536)', codec: 'Cine Raw', max_fps: '2000 fps', data_rate: '40 GB/s' }
            ]
        },
        daily_rate_est: 1800
    },

    // DJI
    {
        id: 'cam-dji-ronin-4d-8k',
        name: 'DJI Ronin 4D 8K Combo',
        brand: 'DJI',
        model: 'Ronin 4D 8K',
        category: 'Camera',
        subcategory: 'Cinema Full Frame',
        description: 'Integrated 4-Axis Gimbal Cinema Camera. LiDAR Focusing. Full Frame 8K.',
        specs: {
            mount: 'DL / E / L / M / PL',
            sensor_size: '36 x 24',
            sensor_type: 'Full Frame', sensor_coverage: 'FF' as const,
            resolution: '8K',
            recording_formats: [
                { resolution: '8K (8192×4320)', codec: 'ProRes RAW HQ', max_fps: '60 fps', data_rate: '3.4 Gbps' },
                { resolution: '4K (4096×2160)', codec: 'ProRes 422 HQ', max_fps: '120 fps', data_rate: '1 Gbps' }
            ]
        },
        daily_rate_est: 450,
        technical_data: [
            {
                title: 'Sensor & Stabilization',
                items: [
                    { label: 'Sensor', value: 'DJI Zenmuse X9-8K Full Frame' },
                    { label: 'Stabilization', value: '4-Axis Active Stabilization (Tilt, Roll, Pan, Z-Axis)' },
                    { label: 'ISO Range', value: 'Dual Native ISO: 800 / 4000' },
                    { label: 'Dynamic Range', value: '14.7 Stops (Canon Profile), 13.8 Stops Lab (SNR=1)' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Rolling Shutter (8K FF)', value: '16.3 ms' },
                    { label: 'Rolling Shutter (4K S35)', value: '14.3 ms' },
                    { label: 'Dynamic Range (ISO 800)', value: '12.7 stops (SNR=2), 13.8 stops (SNR=1)' }
                ]
            },
            {
                title: 'Recording',
                items: [
                    { label: 'Media', value: 'DJI PROSSD 1TB' },
                    { label: 'Codecs', value: 'Apple ProRes RAW, ProRes 422 HQ, H.264' }
                ]
            },
            {
                title: 'Features',
                items: [
                    { label: 'Focus System', value: 'LiDAR Range Finder / AMF (Automated Manual Focus)' },
                    { label: 'Video Transmission', value: 'Built-in O3 Pro Video Transmission' },
                    { label: 'ND Filters', value: 'Built-in 9-stop Physical ND Filters (ND 2 - ND 512)' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://dl.djicdn.com/downloads/DJI_Ronin_4D/DJI_Ronin_4D_User_Manual_v1.0_en.pdf' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 12.7, snr_1: 13.8 },
            rolling_shutter_ms: 16.3,
            base_iso: 800,
            latitude_stops: 12, // Estimated from reviews
            source_url: 'https://www.cined.com/dji-ronin-4d-6k-lab-test-rolling-shutter-dynamic-range-and-latitude/' // Reference to 6K/8K tests
        }
    },

    // --- LENSES (Comprehensive List) ---

    // ARRI Signature Primes (LPL)
    {
        id: 'lens-arri-sig-12',
        name: 'ARRI Signature Prime 12mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 12mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '12mm', aperture: 'T1.8', weight_kg: 2.8, close_focus_m: 0.35, front_diameter_mm: 134, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-15',
        name: 'ARRI Signature Prime 15mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 15mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '15mm', aperture: 'T1.8', weight_kg: 2.8, close_focus_m: 0.35, front_diameter_mm: 156, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-18',
        name: 'ARRI Signature Prime 18mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 18mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '18mm', aperture: 'T1.8', weight_kg: 2.0, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-21',
        name: 'ARRI Signature Prime 21mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 21mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '21mm', aperture: 'T1.8', weight_kg: 1.9, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-25',
        name: 'ARRI Signature Prime 25mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 25mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '25mm', aperture: 'T1.8', weight_kg: 1.9, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-29',
        name: 'ARRI Signature Prime 29mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 29mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '29mm', aperture: 'T1.8', weight_kg: 1.8, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-35',
        name: 'ARRI Signature Prime 35mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 35mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '35mm', aperture: 'T1.8', weight_kg: 1.7, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-40',
        name: 'ARRI Signature Prime 40mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 40mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '40mm', aperture: 'T1.8', weight_kg: 1.8, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-47',
        name: 'ARRI Signature Prime 47mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 47mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '47mm', aperture: 'T1.8', weight_kg: 1.8, close_focus_m: 0.45, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-58',
        name: 'ARRI Signature Prime 58mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 58mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '58mm', aperture: 'T1.8', weight_kg: 2.0, close_focus_m: 0.45, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-75',
        name: 'ARRI Signature Prime 75mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 75mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '75mm', aperture: 'T1.8', weight_kg: 1.9, close_focus_m: 0.65, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-95',
        name: 'ARRI Signature Prime 95mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 95mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '95mm', aperture: 'T1.8', weight_kg: 1.9, close_focus_m: 0.85, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-125',
        name: 'ARRI Signature Prime 125mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 125mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '125mm', aperture: 'T1.8', weight_kg: 2.3, close_focus_m: 1.0, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-150',
        name: 'ARRI Signature Prime 150mm T1.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 150mm T1.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '150mm', aperture: 'T1.8', weight_kg: 3.25, close_focus_m: 1.5, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-200',
        name: 'ARRI Signature Prime 200mm T2.5',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 200mm T2.5',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '200mm', aperture: 'T2.5', weight_kg: 3.1, close_focus_m: 1.8, front_diameter_mm: 114, image_circle_mm: 44.7 },
        daily_rate_est: 450,
        image_url: '/equipment/arri_signature.png'
    },
    {
        id: 'lens-arri-sig-280',
        name: 'ARRI Signature Prime 280mm T2.8',
        brand: 'ARRI',
        model: 'Signature Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 280mm T2.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '280mm', aperture: 'T2.8', weight_kg: 4.3, close_focus_m: 2.5, front_diameter_mm: 134, image_circle_mm: 44.7 },
        daily_rate_est: 550,
        image_url: '/equipment/arri_signature.png'
    },




    // ZEISS CP.3 (PL)
    ...[15, 18, 21, 25, 28, 35, 50, 85, 100, 135].map(fl => ({
        id: `lens-zeiss-cp3-${fl}`,
        name: `Zeiss CP.3 ${fl}mm`,
        brand: 'Zeiss',
        model: 'CP.3',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Gimbal için hafiftir. Kullanıcı mount değiştirebilir. T2.1`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T2.1', weight_kg: 0.8, image_circle_mm: 43.3 },
        daily_rate_est: 120,
        image_url: '/equipment/zeiss_supreme.png'
    })),

    // COOKE S7/i (PL)
    ...[16, 18, 21, 25, 27, 32, 40, 50, 65, 75, 100, 135, 180, 300].map(fl => ({
        id: `lens-cooke-s7-${fl}`,
        name: `Cooke S7/i ${fl}mm`,
        brand: 'Cooke',
        model: 'S7/i',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Cooke Look (sıcak, yumuşak). VV için ideal. T2.0`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: fl === 300 ? 'T3.3' : 'T2.0', weight_kg: 2.2, image_circle_mm: 46.31 },
        daily_rate_est: 400,
        image_url: '/equipment/cooke_s4.png'
    })),

    // COOKE S4/i (PL)
    ...[12, 14, 16, 18, 21, 25, 27, 32, 35, 40, 50, 65, 75, 100, 135, 150, 180, 300].map(fl => ({
        id: `lens-cooke-s4-${fl}`,
        name: `Cooke S4/i ${fl}mm`,
        brand: 'Cooke',
        model: 'S4/i',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Endüstri standardı S35 lensi. T2.0`,
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T2.0', weight_kg: 1.8, image_circle_mm: 33.5 },
        daily_rate_est: 250,
        image_url: '/equipment/cooke_s4.png'
    })),

    // COOKE Panchro/i Classic FF (PL)
    ...[18, 21, 25, 27, 32, 40, 50, '65 Macro', 75, 100, 135, 152].map(fl => ({
        id: `lens-cooke-panchro-${fl}`,
        name: `Cooke Panchro/i Classic ${fl}mm`,
        brand: 'Cooke',
        model: 'Panchro/i FF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Eski Speed Panchro'ların modern gövdede FF versiyonudur. T2.2`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T2.2', weight_kg: 1.5, image_circle_mm: 43.3 },
        daily_rate_est: 300,
        image_url: '/equipment/cooke_s4.png'
    })),

    // COOKE Anamorphic/i FF (PL)
    ...[32, 40, 50, 75, '85 Macro', 100, 135, 180].map(fl => ({
        id: `lens-cooke-ana-${fl}`,
        name: `Cooke Anamorphic/i FF ${fl}mm`,
        brand: 'Cooke',
        model: 'Anamorphic/i FF',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: `1.8x sıkıştırma (squeeze). Full Frame Anamorfik. T2.3`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T2.3', weight_kg: 3.0, image_circle_mm: 43 },
        daily_rate_est: 500,
        image_url: '/equipment/cooke_s4.png'
    })),

    // CANON CN-E (EF) - Standardizing on EF for CN-E as they are native
    ...[14, 20, 24, 35, 50, 85, 135].map(fl => ({
        id: `lens-canon-cne-${fl}`,
        name: `Canon CN-E ${fl}mm`,
        brand: 'Canon',
        model: 'CN-E Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `T1.3 hızıyla çok parlaktır. L-Serisi fotoğraf lensi karakterindedir.`,
        specs: { sensor_coverage: 'FF' as const, mount: 'EF', focal_length: `${fl}mm`, aperture: (fl === 14 || fl === 135) ? 'T1.5' : 'T1.3', weight_kg: 1.3, image_circle_mm: 43.3 },
        daily_rate_est: 180,
        image_url: '/equipment/canon_cne.png'
    })),

    // CANON Sumire (PL)
    ...[14, 20, 24, 35, 50, 85, 135].map(fl => ({
        id: `lens-canon-sum-${fl}`,
        name: `Canon Sumire Prime ${fl}mm`,
        brand: 'Canon',
        model: 'Sumire',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `CN-E'nin Vintage/Yumuşak karakterli versiyonudur.`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: (fl === 14 || fl === 135) ? 'T1.5' : 'T1.3', weight_kg: 1.2, image_circle_mm: 43.3 },
        daily_rate_est: 200,
        image_url: '/equipment/canon_cne.png'
    })),


    // ARRI Ensō Primes (LPL)
    {
        id: 'lens-arri-enso-10',
        name: 'ARRI Ensō Prime 10.5mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 10.5mm T2.1. Tunable look.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '10.5mm', aperture: 'T2.1', weight_kg: 2.3, close_focus_m: 0.27, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-14',
        name: 'ARRI Ensō Prime 14mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 14mm T2.1. Exceptional close focus.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '14mm', aperture: 'T2.1', weight_kg: 1.6, close_focus_m: 0.25, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-18',
        name: 'ARRI Ensō Prime 18mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 18mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '18mm', aperture: 'T2.1', weight_kg: 1.4, close_focus_m: 0.25, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-21',
        name: 'ARRI Ensō Prime 21mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 21mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '21mm', aperture: 'T2.1', weight_kg: 1.4, close_focus_m: 0.25, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-24',
        name: 'ARRI Ensō Prime 24mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 24mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '24mm', aperture: 'T2.1', weight_kg: 1.4, close_focus_m: 0.25, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-28',
        name: 'ARRI Ensō Prime 28mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 28mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '28mm', aperture: 'T2.1', weight_kg: 1.4, close_focus_m: 0.25, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-32',
        name: 'ARRI Ensō Prime 32mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 32mm T2.1. 1:4 Magnification.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '32mm', aperture: 'T2.1', weight_kg: 1.4, close_focus_m: 0.25, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-40',
        name: 'ARRI Ensō Prime 40mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 40mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '40mm', aperture: 'T2.1', weight_kg: 1.4, close_focus_m: 0.28, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-47',
        name: 'ARRI Ensō Prime 47mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 47mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '47mm', aperture: 'T2.1', weight_kg: 1.5, close_focus_m: 0.32, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-58',
        name: 'ARRI Ensō Prime 58mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 58mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '58mm', aperture: 'T2.1', weight_kg: 1.6, close_focus_m: 0.38, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-75',
        name: 'ARRI Ensō Prime 75mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 75mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '75mm', aperture: 'T2.1', weight_kg: 1.7, close_focus_m: 0.43, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-105',
        name: 'ARRI Ensō Prime 105mm T2.1',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 105mm T2.1',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '105mm', aperture: 'T2.1', weight_kg: 1.8, close_focus_m: 0.60, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-150',
        name: 'ARRI Ensō Prime 150mm T2.5',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 150mm T2.5',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '150mm', aperture: 'T2.5', weight_kg: 2.1, close_focus_m: 0.85, front_diameter_mm: 95 },
        daily_rate_est: 350
    },
    {
        id: 'lens-arri-enso-250',
        name: 'ARRI Ensō Prime 250mm T2.8',
        brand: 'ARRI',
        model: 'Ensō Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'LPL Mount. 250mm T2.8',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '250mm', aperture: 'T2.8', weight_kg: 2.5, close_focus_m: 1.2, front_diameter_mm: 95 },
        daily_rate_est: 350
    },

    // ARRI Signature Zooms (LPL)
    {
        id: 'lens-arri-sig-zoom-16-32',
        name: 'ARRI Signature Zoom 16-32mm T2.8',
        brand: 'ARRI',
        model: 'Signature Zoom',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'LPL Mount. Universal Zoom with Extension capable.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '16-32mm', aperture: 'T2.8', weight_kg: 3.8, close_focus_m: 0.19, front_diameter_mm: 156 },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-sig-zoom-24-75',
        name: 'ARRI Signature Zoom 24-75mm T2.8',
        brand: 'ARRI',
        model: 'Signature Zoom',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'LPL Mount. Universal Zoom.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '24-75mm', aperture: 'T2.8', weight_kg: 4.1, close_focus_m: 0.41, front_diameter_mm: 114 },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-sig-zoom-45-135',
        name: 'ARRI Signature Zoom 45-135mm T2.8',
        brand: 'ARRI',
        model: 'Signature Zoom',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'LPL Mount. Universal Zoom.',
        specs: { mount: 'LPL', focal_length: '45-135mm', aperture: 'T2.8', weight_kg: 3.75, close_focus_m: 0.65, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-sig-zoom-65-300',
        name: 'ARRI Signature Zoom 65-300mm T2.8',
        brand: 'ARRI',
        model: 'Signature Zoom',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'LPL Mount. The longest zoom. Includes 1.7x Extender (110-510mm).',
        specs: { mount: 'LPL', focal_length: '65-300mm', aperture: 'T2.8', weight_kg: 8.1, close_focus_m: 1.3, front_diameter_mm: 156, sensor_coverage: 'LF' as const },
        daily_rate_est: 1400
    },

    // ARRI Ultra Wide Zoom (UWZ)
    {
        id: 'lens-arri-uwz-9.5-18',
        name: 'ARRI Ultra Wide Zoom 9.5-18mm T2.9',
        brand: 'ARRI',
        model: 'UWZ 9.5-18',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'The rectilinear wide-angle zoom. Zero distortion. PL Mount.',
        specs: { mount: 'PL', focal_length: '9.5-18mm', aperture: 'T2.9', weight_kg: 4.8, close_focus_m: 0.55, front_diameter_mm: 134, image_circle_mm: 34.5, sensor_coverage: 'S35' as const },
        daily_rate_est: 950
    },

    // ARRI Anamorphic Ultra Wide Zoom (AUWZ)
    {
        id: 'lens-arri-auwz-19-36',
        name: 'ARRI Anamorphic Ultra Wide Zoom 19-36mm T4.2',
        brand: 'ARRI',
        model: 'AUWZ 19-36',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'The world\'s widest anamorphic zoom. No distortion/breathing. T4.2',
        specs: { mount: 'PL', focal_length: '19-36mm', aperture: 'T4.2', squeeze: '2x', weight_kg: 5.5, close_focus_m: 0.6, front_diameter_mm: 114, image_circle_mm: 31.1, sensor_coverage: 'S35' as const },
        daily_rate_est: 1800
    },

    // ARRI/Zeiss Master Anamorphic Lenses (PL)
    {
        id: 'lens-arri-ma-28',
        name: 'ARRI Master Anamorphic 28mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '28mm T1.9 Anamorphic Prime. No breathing, low distortion.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '28mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 2.5, close_focus_m: 0.65, front_diameter_mm: 114 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-35',
        name: 'ARRI Master Anamorphic 35mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '35mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '35mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 2.6, close_focus_m: 0.75, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-40',
        name: 'ARRI Master Anamorphic 40mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '40mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '40mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 2.7, close_focus_m: 0.70, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-50',
        name: 'ARRI Master Anamorphic 50mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '50mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '50mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 2.6, close_focus_m: 0.75, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-60',
        name: 'ARRI Master Anamorphic 60mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '60mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '60mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 2.7, close_focus_m: 0.90, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-75',
        name: 'ARRI Master Anamorphic 75mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '75mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '75mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 2.6, close_focus_m: 0.90, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-100',
        name: 'ARRI Master Anamorphic 100mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '100mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '100mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 3.1, close_focus_m: 0.95, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-135',
        name: 'ARRI Master Anamorphic 135mm T1.9',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '135mm T1.9 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '135mm', aperture: 'T1.9', squeeze: '2x', weight_kg: 3.7, close_focus_m: 1.20, front_diameter_mm: 95 },
        daily_rate_est: 600
    },
    {
        id: 'lens-arri-ma-180',
        name: 'ARRI Master Anamorphic 180mm T2.8',
        brand: 'ARRI/Zeiss',
        model: 'Master Anamorphic',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: '180mm T2.8 Anamorphic Prime.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '180mm', aperture: 'T2.8', squeeze: '2x', weight_kg: 3.2, close_focus_m: 1.50, front_diameter_mm: 95 },
        daily_rate_est: 600
    },

    // ARRI/Zeiss Master Primes (PL) - The Gold Standard
    ...[12, 14, 16, 18, 21, 25, 27, 32, 35, 40, 50, 65, 75, 100, 135, 150].map(fl => ({
        id: `lens-arri-mp-${fl}`,
        name: `ARRI Master Prime ${fl}mm T1.3`,
        brand: 'ARRI/Zeiss',
        model: 'Master Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `PL Mount. ${fl}mm T1.3. Sharp, high contrast, perfect bokeh.`,
        specs: { mount: 'PL', focal_length: `${fl}mm`, aperture: 'T1.3', weight_kg: 2.2, close_focus_m: 0.35, front_diameter_mm: 114, sensor_coverage: 'S35' as const },
        daily_rate_est: 550
    })),

    // ARRI/Zeiss Ultra Primes (PL) - The Workhorse
    {
        id: 'lens-arri-up-8r',
        name: 'ARRI Ultra Prime 8R mm T2.8',
        brand: 'ARRI/Zeiss',
        model: 'Ultra Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'PL Mount. 8R mm T2.8. Rectilinear wide angle.',
        specs: { mount: 'PL', focal_length: '8mm', aperture: 'T2.8', weight_kg: 2.0, close_focus_m: 0.35, front_diameter_mm: 134, sensor_coverage: 'S35' as const },
        daily_rate_est: 400
    },
    ...[10, 12, 14, 16, 20, 24, 28, 32, 40, 50, 65, 85, 100, 135, 180].map(fl => ({
        id: `lens-arri-up-${fl}`,
        name: `ARRI Ultra Prime ${fl}mm T1.9`,
        brand: 'ARRI/Zeiss',
        model: 'Ultra Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `PL Mount. ${fl}mm T1.9. Compact and lightweight.`,
        specs: { mount: 'PL', focal_length: `${fl}mm`, aperture: 'T1.9', weight_kg: fl === 180 ? 2.6 : 1.2, close_focus_m: 0.3, front_diameter_mm: fl < 16 ? 114 : 95, sensor_coverage: 'S35' as const },
        daily_rate_est: 350
    })),

    // ARRI Rental DNA LF (LPL)
    {
        id: 'lens-arri-dna-lf-21',
        name: 'ARRI Rental DNA LF 21mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 21mm T1.5. Vintage character, tunable look for Large Format.',
        specs: { mount: 'LPL', focal_length: '21mm', aperture: 'T1.5', weight_kg: 1.8, close_focus_m: 0.20, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-25',
        name: 'ARRI Rental DNA LF 25mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 25mm T1.5. Large Format vintage prime.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '25mm', aperture: 'T1.5', weight_kg: 1.9, close_focus_m: 0.25, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-29',
        name: 'ARRI Rental DNA LF 29mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 29mm T1.5. Unique character.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '29mm', aperture: 'T1.5', weight_kg: 1.9, close_focus_m: 0.30, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-35',
        name: 'ARRI Rental DNA LF 35mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 35mm T1.5. Classic focal length re-imagined.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '35mm', aperture: 'T1.5', weight_kg: 2.0, close_focus_m: 0.30, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-40',
        name: 'ARRI Rental DNA LF 40mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 40mm T1.5.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '40mm', aperture: 'T1.5', weight_kg: 2.1, close_focus_m: 0.35, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-50',
        name: 'ARRI Rental DNA LF 50mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 50mm T1.5.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '50mm', aperture: 'T1.5', weight_kg: 2.2, close_focus_m: 0.45, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-75',
        name: 'ARRI Rental DNA LF 75mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 75mm T1.5. Beautiful portrait lens.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '75mm', aperture: 'T1.5', weight_kg: 2.3, close_focus_m: 0.65, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-100',
        name: 'ARRI Rental DNA LF 100mm T1.5',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 100mm T1.5.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '100mm', aperture: 'T1.5', weight_kg: 2.4, close_focus_m: 0.85, front_diameter_mm: 114 },
        daily_rate_est: 900
    },
    {
        id: 'lens-arri-dna-lf-135',
        name: 'ARRI Rental DNA LF 135mm T2.0',
        brand: 'ARRI Rental',
        model: 'DNA LF',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 135mm T2.0.',
        specs: { sensor_coverage: 'LF' as const, mount: 'LPL', focal_length: '135mm', aperture: 'T2.0', weight_kg: 2.6, close_focus_m: 1.1, front_diameter_mm: 114 },
        daily_rate_est: 900
    },

    // ARRI Rental Prime DNA (LPL) - For Alexa 65
    {
        id: 'lens-arri-prime-dna-28',
        name: 'ARRI Rental Prime DNA 28mm T2.8',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 28mm T2.8. For Alexa 65 (65mm format). Vintage character.',
        specs: { mount: 'LPL', focal_length: '28mm', aperture: 'T2.8', weight_kg: 1.6, close_focus_m: 0.45, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-35',
        name: 'ARRI Rental Prime DNA 35mm T2.3',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 35mm T2.3. Alexa 65 coverage.',
        specs: { mount: 'LPL', focal_length: '35mm', aperture: 'T2.3', weight_kg: 1.7, close_focus_m: 0.45, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-36',
        name: 'ARRI Rental Prime DNA 36mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 36mm T2.0. High speed wide angle.',
        specs: { mount: 'LPL', focal_length: '36mm', aperture: 'T2.0', weight_kg: 1.8, close_focus_m: 0.33, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-45',
        name: 'ARRI Rental Prime DNA 45mm T2.3',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 45mm T2.3.',
        specs: { mount: 'LPL', focal_length: '45mm', aperture: 'T2.3', weight_kg: 1.9, close_focus_m: 0.45, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-50',
        name: 'ARRI Rental Prime DNA 50mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 50mm T2.0.',
        specs: { mount: 'LPL', focal_length: '50mm', aperture: 'T2.0', weight_kg: 2.0, close_focus_m: 0.81, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-55',
        name: 'ARRI Rental Prime DNA 55mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 55mm T2.0.',
        specs: { mount: 'LPL', focal_length: '55mm', aperture: 'T2.0', weight_kg: 2.1, close_focus_m: 0.45, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-60',
        name: 'ARRI Rental Prime DNA 60mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 60mm T2.0.',
        specs: { mount: 'LPL', focal_length: '60mm', aperture: 'T2.0', weight_kg: 2.2, close_focus_m: 0.60, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-65',
        name: 'ARRI Rental Prime DNA 65mm T1.6',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 65mm T1.6. Ultra high speed "Hero" lens.',
        specs: { mount: 'LPL', focal_length: '65mm', aperture: 'T1.6', weight_kg: 2.3, close_focus_m: 0.60, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1100
    },
    {
        id: 'lens-arri-prime-dna-70',
        name: 'ARRI Rental Prime DNA 70mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 70mm T2.0.',
        specs: { mount: 'LPL', focal_length: '70mm', aperture: 'T2.0', weight_kg: 2.4, close_focus_m: 0.60, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-80',
        name: 'ARRI Rental Prime DNA 80mm T1.9',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 80mm T1.9. Beautiful portrait focal length.',
        specs: { mount: 'LPL', focal_length: '80mm', aperture: 'T1.9', weight_kg: 2.5, close_focus_m: 0.85, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-110',
        name: 'ARRI Rental Prime DNA 110mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 110mm T2.0.',
        specs: { mount: 'LPL', focal_length: '110mm', aperture: 'T2.0', weight_kg: 2.8, close_focus_m: 1.0, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-120',
        name: 'ARRI Rental Prime DNA 120mm T2.0',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 120mm T2.0.',
        specs: { mount: 'LPL', focal_length: '120mm', aperture: 'T2.0', weight_kg: 3.0, close_focus_m: 1.1, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-150',
        name: 'ARRI Rental Prime DNA 150mm T2.8',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 150mm T2.8.',
        specs: { mount: 'LPL', focal_length: '150mm', aperture: 'T2.8', weight_kg: 3.5, close_focus_m: 1.5, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-prime-dna-200',
        name: 'ARRI Rental Prime DNA 200mm T2.8',
        brand: 'ARRI Rental',
        model: 'Prime DNA',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 200mm T2.8.',
        specs: { mount: 'LPL', focal_length: '200mm', aperture: 'T2.8', weight_kg: 4.0, close_focus_m: 1.8, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },

    // ARRI Rental ALFA (LPL) - Anamorphic
    {
        id: 'lens-arri-alfa-32',
        name: 'ARRI Rental ALFA 32mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 32mm T2.5. 2x Anamorphic. Tuned vintage look.',
        specs: { mount: 'LPL', focal_length: '32mm', aperture: 'T2.5', weight_kg: 2.5, close_focus_m: 0.69, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-40',
        name: 'ARRI Rental ALFA 40mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 40mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '40mm', aperture: 'T2.5', weight_kg: 2.5, close_focus_m: 0.76, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-47',
        name: 'ARRI Rental ALFA 47mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 47mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '47mm', aperture: 'T2.5', weight_kg: 2.6, close_focus_m: 0.76, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-60',
        name: 'ARRI Rental ALFA 60mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 60mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '60mm', aperture: 'T2.5', weight_kg: 2.7, close_focus_m: 0.74, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-72',
        name: 'ARRI Rental ALFA 72mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 72mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '72mm', aperture: 'T2.5', weight_kg: 2.8, close_focus_m: 0.90, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-90',
        name: 'ARRI Rental ALFA 90mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 90mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '90mm', aperture: 'T2.5', weight_kg: 2.9, close_focus_m: 1.0, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-108',
        name: 'ARRI Rental ALFA 108mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 108mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '108mm', aperture: 'T2.5', weight_kg: 3.0, close_focus_m: 1.2, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-145',
        name: 'ARRI Rental ALFA 145mm T2.5',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 145mm T2.5. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '145mm', aperture: 'T2.5', weight_kg: 3.2, close_focus_m: 1.5, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },
    {
        id: 'lens-arri-alfa-190',
        name: 'ARRI Rental ALFA 190mm T3.0',
        brand: 'ARRI Rental',
        model: 'ALFA',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: 'LPL Mount. 190mm T3.0. 2x Anamorphic.',
        specs: { mount: 'LPL', focal_length: '190mm', aperture: 'T3.0', weight_kg: 3.5, close_focus_m: 1.8, front_diameter_mm: 114, sensor_coverage: 'LF' as const },
        daily_rate_est: 1200
    },

    // ARRI Rental MOVIECAM (LPL) - Vintage Re-housed
    {
        id: 'lens-arri-moviecam-16',
        name: 'ARRI Rental Moviecam 16mm T2',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 16mm T2. Vintage 70s optics, modern housing.',
        specs: { mount: 'LPL', focal_length: '16mm', aperture: 'T2', weight_kg: 1.4, close_focus_m: 0.25, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-24',
        name: 'ARRI Rental Moviecam 24mm T2',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 24mm T2. Character rich vintage look.',
        specs: { mount: 'LPL', focal_length: '24mm', aperture: 'T2', weight_kg: 1.5, close_focus_m: 0.25, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-35',
        name: 'ARRI Rental Moviecam 35mm T2',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 35mm T2.',
        specs: { mount: 'LPL', focal_length: '35mm', aperture: 'T2', weight_kg: 1.6, close_focus_m: 0.35, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-40',
        name: 'ARRI Rental Moviecam 40mm T2',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 40mm T2.',
        specs: { mount: 'LPL', focal_length: '40mm', aperture: 'T2', weight_kg: 1.7, close_focus_m: 0.40, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-50',
        name: 'ARRI Rental Moviecam 50mm T2',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 50mm T2.',
        specs: { mount: 'LPL', focal_length: '50mm', aperture: 'T2', weight_kg: 1.7, close_focus_m: 0.45, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-60',
        name: 'ARRI Rental Moviecam 60mm T1.5',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 60mm T1.5. Special high-speed optic.',
        specs: { mount: 'LPL', focal_length: '60mm', aperture: 'T1.5', weight_kg: 1.9, close_focus_m: 0.50, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 950
    },
    {
        id: 'lens-arri-moviecam-75',
        name: 'ARRI Rental Moviecam 75mm T2',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 75mm T2.',
        specs: { mount: 'LPL', focal_length: '75mm', aperture: 'T2', weight_kg: 1.8, close_focus_m: 0.75, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-100',
        name: 'ARRI Rental Moviecam 100mm T2.8',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 100mm T2.8.',
        specs: { mount: 'LPL', focal_length: '100mm', aperture: 'T2.8', weight_kg: 2.0, close_focus_m: 1.0, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },
    {
        id: 'lens-arri-moviecam-135',
        name: 'ARRI Rental Moviecam 135mm T2.8',
        brand: 'ARRI Rental',
        model: 'Moviecam',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: 'LPL Mount. 135mm T2.8.',
        specs: { mount: 'LPL', focal_length: '135mm', aperture: 'T2.8', weight_kg: 2.2, close_focus_m: 1.2, front_diameter_mm: 95, sensor_coverage: 'LF' as const },
        daily_rate_est: 850
    },

    // ARRI/Fujinon Alura Zooms (PL)
    {
        id: 'lens-arri-alura-18-80',
        name: 'ARRI Alura 18-80mm T2.6',
        brand: 'ARRI/Fujinon',
        model: 'Alura Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: 'PL Mount. Modern zoom performance. 18-80mm.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '18-80mm', aperture: 'T2.6', weight_kg: 4.7, close_focus_m: 0.7, front_diameter_mm: 134 },
        daily_rate_est: 650
    },
    {
        id: 'lens-arri-alura-45-250',
        name: 'ARRI Alura 45-250mm T2.6',
        brand: 'ARRI/Fujinon',
        model: 'Alura Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: 'PL Mount. Long range zoom. 45-250mm.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '45-250mm', aperture: 'T2.6', weight_kg: 7.5, close_focus_m: 1.2, front_diameter_mm: 134 },
        daily_rate_est: 700
    },
    {
        id: 'lens-arri-alura-15.5-45',
        name: 'ARRI Alura 15.5-45mm T2.8',
        brand: 'ARRI/Fujinon',
        model: 'Alura Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: 'PL Mount. Lightweight wide zoom.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '15.5-45mm', aperture: 'T2.8', weight_kg: 2.2, close_focus_m: 0.6, front_diameter_mm: 114 },
        daily_rate_est: 500
    },
    {
        id: 'lens-arri-alura-30-80',
        name: 'ARRI Alura 30-80mm T2.8',
        brand: 'ARRI/Fujinon',
        model: 'Alura Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: 'PL Mount. Lightweight tele zoom.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '30-80mm', aperture: 'T2.8', weight_kg: 2.2, close_focus_m: 0.6, front_diameter_mm: 114 },
        daily_rate_est: 500
    },

    // SIGMA Cine High Speed (PL)
    ...[14, 20, 24, 28, 35, 40, 50, 65, 85, 105, 135].map(fl => ({
        id: `lens-sigma-cine-${fl}`,
        name: `Sigma Cine ${fl}mm`,
        brand: 'Sigma',
        model: 'Cine High Speed',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Fiyat/Performans kralı. Çok keskin ama klinik görüntü. T1.5`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: (fl === 14 || fl === 135) ? 'T2.0' : 'T1.5', weight_kg: 1.1, image_circle_mm: 43.3 },
        daily_rate_est: 120,
        image_url: '/equipment/sigma_cine.png'
    })),

    // SIGMA Classic Art (PL)
    ...[14, 20, 24, 28, 35, 40, 50, 85, 105, 135].map(fl => ({
        id: `lens-sigma-classic-${fl}`,
        name: `Sigma Classic Art ${fl}mm`,
        brand: 'Sigma',
        model: 'Classic Art Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Kaplamasız (Uncoated) lensler. Düşük kontrast ve bol flare. T2.5`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: (fl === 14 || fl === 135) ? 'T3.2' : 'T2.5', weight_kg: 1.2, image_circle_mm: 43.3 },
        daily_rate_est: 140,
        image_url: '/equipment/sigma_cine.png'
    })),

    // TOKINA VISTA (PL)
    ...[18, 21, 25, 29, 35, 40, 50, 65, 85, 105, 135, 180].map(fl => ({
        id: `lens-tokina-vista-${fl}`,
        name: `Tokina Vista ${fl}mm`,
        brand: 'Tokina',
        model: 'Vista Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Nefes alma (breathing) neredeyse sıfırdır. T1.5`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T1.5', weight_kg: 2.1, image_circle_mm: 46.7 },
        daily_rate_est: 220,
        image_url: '/equipment/zeiss_supreme.png'
    })),

    // LEITZ Thalia (PL)
    ...[24, 30, 35, 45, 55, 70, 90, 100, 120, 180].map(fl => ({
        id: `lens-leitz-thalia-${fl}`,
        name: `Leitz Thalia ${fl}mm`,
        brand: 'Leitz/Leica',
        model: 'Thalia',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Orta format karakteri. ARRI Alexa 65 dahil her şeyi kapsar.`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: (fl === 90 || fl === 100 || fl > 120) ? 'T2.2/Top' : 'T2.6', weight_kg: 1.4, image_circle_mm: 60 },
        daily_rate_est: 600,
        image_url: '/equipment/zeiss_supreme.png'
    })),

    // LEITZ Hugo (LPL)
    ...[18, 21, 24, 28, 35, 50, 75, 90, 135].map(fl => ({
        id: `lens-leitz-hugo-${fl}`,
        name: `Leitz Hugo ${fl}mm`,
        brand: 'Leitz/Leica',
        model: 'Hugo',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Efsanevi Leica M fotoğraf lenslerinin sinema gövdesine aktarılmış halidir. T1.5`,
        specs: { sensor_coverage: 'FF' as const, mount: 'LPL', focal_length: `${fl}mm`, aperture: 'T1.5', weight_kg: 0.8, image_circle_mm: 43.3 },
        daily_rate_est: 550,
        image_url: '/equipment/zeiss_supreme.png'
    })),

    // LEITZ Summilux-C (PL)
    ...[16, 18, 21, 25, 29, 35, 40, 50, 65, 75, 100, 135].map(fl => ({
        id: `lens-leitz-summilux-${fl}`,
        name: `Leitz Summilux-C ${fl}mm`,
        brand: 'Leitz/Leica',
        model: 'Summilux-C',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Master Prime'ın en büyük rakibi. Daha kompakt. T1.4`,
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T1.4', weight_kg: 1.6, image_circle_mm: 33 },
        daily_rate_est: 400,
        image_url: '/equipment/zeiss_supreme.png'
    })),



    // ATLAS Mercury (PL)
    ...[36, 42, 54, 72, 95].map(fl => ({
        id: `lens-atlas-mercury-${fl}`,
        name: `Atlas Mercury ${fl}mm`,
        brand: 'Atlas',
        model: 'Mercury Anamorphic',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: `1.5x sıkıştırma. Full Frame sensörler için özel tasarım. T2.2`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T2.2', weight_kg: 1.6, image_circle_mm: 43.3 },
        daily_rate_est: 320,
        image_url: '/equipment/atlas_orion.png'
    })),

    // ANGENIEUX Optimo Primes (PL)
    ...[18, 21, 24, 28, 32, 40, 50, 60, 75, 100, 135, 200].map(fl => ({
        id: `lens-ang-prime-${fl}`,
        name: `Angenieux Optimo Prime ${fl}mm`,
        brand: 'Angenieux',
        model: 'Optimo Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Lensin içindeki filtre (IOP) değiştirilerek karakteri değiştirilebilir. T1.8`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T1.8', weight_kg: 1.7, image_circle_mm: 46.5 },
        daily_rate_est: 450,
        image_url: '/equipment/angenieux_optimo.png'
    })),

    // ANGENIEUX Zooms
    { id: 'lens-ang-ultra-12x', name: 'Angenieux Optimo Ultra 12x', brand: 'Angenieux', model: 'Optimo Ultra 12x', category: 'Lens' as const, subcategory: 'Zoom', description: 'Tek lens, arka grubu değişerek hem S35 hem FF olur.', specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '24-290mm', aperture: 'T2.8', weight_kg: 12.6, image_circle_mm: 46.3 }, daily_rate_est: 1200, image_url: '/equipment/angenieux_optimo.png' },


    // FUJINON Premista
    ...['19-45mm', '28-100mm', '80-250mm'].map(fl => ({
        id: `lens-fuji-premista-${fl.split('-')[0]}`,
        name: `Fujinon Premista ${fl}`,
        brand: 'Fujinon',
        model: 'Premista Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: `Modern geniş format zoom standardı.`,
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: fl, aperture: 'T2.9', weight_kg: 3.8, image_circle_mm: 46.3 },
        daily_rate_est: 650,
        image_url: '/equipment/angenieux_optimo.png'
    })),

    // FUJINON Cabrio
    ...['14-35mm', '19-90mm', '85-300mm', '25-300mm'].map(fl => ({
        id: `lens-fuji-cabrio-${fl.split('-')[0]}`,
        name: `Fujinon Cabrio ${fl}`,
        brand: 'Fujinon',
        model: 'Cabrio (ZK) Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: `Üzerinde servo motor vardır (ENG tarzı kullanım için).`,
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: fl, aperture: 'T2.9', weight_kg: 2.9, image_circle_mm: 31.5 },
        daily_rate_est: 500,
        technical_data: [
            {
                title: 'Sensor',
                items: [
                    { label: 'Sensor Type', value: 'Super 35mm DGO (Dual Gain Output) Sensor' }
                ]
            },
            {
                title: 'Lab Performance (CineD)',
                items: [
                    { label: 'Dynamic Range', value: '12.8 stops (DGO On)' },
                    { label: 'Rolling Shutter', value: '~15-16 ms' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://www.usa.canon.com/support/p/eos-c300-mark-iii' }
                ]
            }
        ],
        lab_metrics: {
            dynamic_range_stops: { snr_2: 12.8, snr_1: 13.8 },
            rolling_shutter_ms: 15.5,
            base_iso: 800,
            latitude_stops: 12,
            source_url: 'https://www.cined.com/canon-c300-mark-iii-lab-test-dynamic-range-latitude-and-rolling-shutter/'
        },
        image_url: '/equipment/angenieux_optimo.png'
    })),

    // DZOFilm Vespid (PL)
    ...[12, 16, 21, 25, 35, 40, 50, 75, '90 Macro', 100, 125].map(fl => ({
        id: `lens-dzo-vespid-${fl}`,
        name: `DZOFilm Vespid ${fl}mm`,
        brand: 'DZOFilm',
        model: 'Vespid Prime',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Fiyat/Performans odaklı. "Retro" serisi altın kaplamalıdır.`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: (fl === 12 || fl === 16) ? 'T2.8' : 'T2.1', weight_kg: 0.9, image_circle_mm: 46.5 },
        daily_rate_est: 70
    })),

    // DZO Pictor Zoom
    ...['12-25mm', '20-55mm', '50-125mm'].map(fl => ({
        id: `lens-dzo-pictor-${fl.split('-')[0]}`,
        name: `DZOFilm Pictor ${fl}`,
        brand: 'DZOFilm',
        model: 'Pictor Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: `Parfokal (zoom yapınca netlik bozulmaz). Sadece S35.`,
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: fl, aperture: 'T2.8', weight_kg: 1.6, image_circle_mm: 31.5 },
        daily_rate_est: 140
    })),

    // DZO Catta Zoom
    ...['18-35mm', '35-80mm', '70-135mm'].map(fl => ({
        id: `lens-dzo-catta-${fl.split('-')[0]}`,
        name: `DZOFilm Catta ${fl}`,
        brand: 'DZOFilm',
        model: 'Catta Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: `Aynasız (Mirrorless) mountlar için tasarlanmış FF zoomlar.`,
        specs: { sensor_coverage: 'FF' as const, mount: 'E-Mount', focal_length: fl, aperture: 'T2.9', weight_kg: 1.5, image_circle_mm: 43.5 },
        daily_rate_est: 150
    })),

    // LAOWA Nanomorph
    ...[27, 35, 50, 65, 80].map(fl => ({
        id: `lens-laowa-nano-${fl}`,
        name: `Laowa Nanomorph ${fl}mm`,
        brand: 'Laowa',
        model: 'Nanomorph',
        category: 'Lens' as const,
        subcategory: 'Anamorphic',
        description: `Dünyanın en küçük anamorfik lensleri. 1.5x sıkıştırma.`,
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: `${fl}mm`, aperture: 'T2.4', weight_kg: 0.4, image_circle_mm: 25.6 },
        daily_rate_est: 90
    })),

    // LAOWA Rangers
    ...['16-30mm', '28-75mm', '75-180mm'].map(fl => ({
        id: `lens-laowa-ranger-${fl.split('-')[0]}`,
        name: `Laowa Ranger ${fl}`,
        brand: 'Laowa',
        model: 'Ranger Zoom',
        category: 'Lens' as const,
        subcategory: 'Zoom',
        description: `Çok kompakt Full Frame "run-and-gun" zoom seti.`,
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: fl, aperture: 'T2.9', weight_kg: 1.4, image_circle_mm: 43.2 },
        daily_rate_est: 160
    })),

    // PANAVISION Primo 70
    ...[27, 35, 40, 50, 65, 80, 100, 125, 150, 200, 250].map(fl => ({
        id: `lens-pv-70-${fl}`,
        name: `Panavision Primo 70 ${fl}mm`,
        brand: 'Panavision',
        model: 'Primo 70',
        category: 'Lens' as const,
        subcategory: 'Spherical',
        description: `Sadece Panavision'dan kiralanabilir. PV mount özeldir. T2.0`,
        specs: { sensor_coverage: 'LF' as const, mount: 'PV70', focal_length: `${fl}mm`, aperture: 'T2.0', weight_kg: 2.5, image_circle_mm: 50.0 },
        daily_rate_est: 700
    })),

    // --- ACCESSORIES (New Categories) ---

    // FILTRATION & MATTE BOX
    { id: 'acc-mb-arri', name: 'ARRI LMB 4x5 Pro Set', brand: 'ARRI', model: 'LMB 4x5', category: 'Support', subcategory: 'Matte Box', description: 'Clamp-on matte box with 3 stages.', specs: { weight_kg: 1.5 }, daily_rate_est: 80 },
    { id: 'acc-mb-bt', name: 'Bright Tangerine Misfit Kick', brand: 'Bright Tangerine', model: 'Misfit Kick', category: 'Support', subcategory: 'Matte Box', description: 'Core 3-stage kit. Carbon fiber.', specs: { weight_kg: 1.2 }, daily_rate_est: 70 },

    // FILTERS - TIFFEN IRND
    ...['0.3', '0.6', '0.9', '1.2', '1.5', '1.8', '2.1', '2.4'].map(nd => ({
        id: `filt-tif-irnd-${nd.replace('.', '')}`,
        name: `Tiffen IRND ${nd}`,
        brand: 'Tiffen',
        model: `NATural ND ${nd}`,
        category: 'Filter' as const,
        subcategory: 'ND',
        description: 'Full Spectrum IRND. 4x5.65".',
        specs: {},
        daily_rate_est: 25
    })),
    // FILTERS - TIFFEN DIFFUSION
    ...['1/8', '1/4', '1/2', '1', '2'].map(str => ({
        id: `filt-tif-bpm-${str.replace('/', '')}`,
        name: `Tiffen Black Pro-Mist ${str}`,
        brand: 'Tiffen',
        model: `Black Pro-Mist ${str}`,
        category: 'Filter' as const,
        subcategory: 'Diffusion',
        description: 'Halation and contrast reduction.',
        specs: {},
        daily_rate_est: 20
    })),
    ...['1/8', '1/4', '1/2', '1', '2'].map(str => ({
        id: `filt-tif-gg-${str.replace('/', '')}`,
        name: `Tiffen Glimmerglass ${str}`,
        brand: 'Tiffen',
        model: `Glimmerglass ${str}`,
        category: 'Filter' as const,
        subcategory: 'Diffusion',
        description: 'Softens highlights while keeping sharpness.',
        specs: {},
        daily_rate_est: 20
    })),
    ...['1/8', '1/4', '1/2'].map(str => ({
        id: `filt-tif-pearl-${str.replace('/', '')}`,
        name: `Tiffen Pearlescent ${str}`,
        brand: 'Tiffen',
        model: `Pearlescent ${str}`,
        category: 'Filter' as const,
        subcategory: 'Diffusion',
        description: 'Reduces contrast and creates a pearlescent halo.',
        specs: {},
        daily_rate_est: 20
    })),
    // FILTERS - SCHNEIDER
    ...['1/8', '1/4', '1/2', '1'].map(str => ({
        id: `filt-sch-hbm-${str.replace('/', '')}`,
        name: `Schneider Hollywood Black Magic ${str}`,
        brand: 'Schneider',
        model: `HBM ${str}`,
        category: 'Filter' as const,
        subcategory: 'Diffusion',
        description: 'Classic film look. Smooths skin tones.',
        specs: {},
        daily_rate_est: 25
    })),
    // FILTERS - POLARIZER
    { id: 'filt-tif-pol', name: 'Tiffen Circular Polarizer', brand: 'Tiffen', model: 'Circular Ultra Pol', category: 'Filter', subcategory: 'Polarizer', description: 'Reduces reflections and increases saturation.', specs: {}, daily_rate_est: 35 },
    { id: 'filt-sch-pol', name: 'Schneider True-Pol', brand: 'Schneider', model: 'True-Pol', category: 'Filter', subcategory: 'Polarizer', description: 'Linear polarizer.', specs: {}, daily_rate_est: 35 },
    { id: 'filt-arri-rota', name: 'ARRI Rota Pola Frame', brand: 'ARRI', model: 'Rota Pola', category: 'Filter', subcategory: 'Specialty', description: 'Geared rotating polarizer frame.', specs: {}, daily_rate_est: 60 },
    { id: 'filt-lin-fsnd-set', name: 'Lindsey Optics FSND Set', brand: 'Lindsey Optics', model: 'FSND', category: 'Filter', subcategory: 'ND Set', description: 'Full Set (.3 - 2.1). 4x5.65".', specs: {}, daily_rate_est: 150 },

    // WIRELESS & FIZ
    { id: 'acc-teradek-bolt6', name: 'Teradek Bolt 6 LT 750', brand: 'Teradek', model: 'Bolt 6 LT', category: 'Support', subcategory: 'Wireless Video', description: 'Zero-delay 6GHz wireless video.', specs: {}, daily_rate_est: 250 },
    { id: 'acc-teradek-bolt4k', name: 'Teradek Bolt 4K LT 750', brand: 'Teradek', model: 'Bolt 4K LT', category: 'Support', subcategory: 'Wireless Video', description: '4K Wireless Video. HDMI/SDI.', specs: {}, daily_rate_est: 200 },
    { id: 'acc-preston-hu4', name: 'Preston HU4 Hand Unit', brand: 'Preston', model: 'HU4', category: 'Support', subcategory: 'FIZ', description: 'Industry standard focus puller hand unit.', specs: {}, daily_rate_est: 400 },
    { id: 'acc-arri-hi5', name: 'ARRI Hi-5 Hand Unit', brand: 'ARRI', model: 'Hi-5', category: 'Support', subcategory: 'FIZ', description: 'Advanced hand unit with radio modules.', specs: {}, daily_rate_est: 350 },
    { id: 'acc-arri-wcu4', name: 'ARRI WCU-4', brand: 'ARRI', model: 'WCU-4', category: 'Support', subcategory: 'FIZ', description: 'Wireless Compact Unit. The standard.', specs: {}, daily_rate_est: 300 },
    { id: 'acc-tilta-nuc', name: 'Tilta Nucleus-M Kit', brand: 'Tilta', model: 'Nucleus-M', category: 'Support', subcategory: 'FIZ', description: 'Wireless lens control system (2 motors).', specs: {}, daily_rate_est: 80 },

    // CAMERA SUPPORT & RIgs
    { id: 'sup-easy-vario5', name: 'Easyrig Vario 5', brand: 'Easyrig', model: 'Vario 5', category: 'Support', subcategory: 'Vest', description: 'Gimbal Rig vest + Serene arm.', specs: { payload_kg: 17 }, daily_rate_est: 150 },
    { id: 'sup-easy-minimax', name: 'Easyrig Minimax', brand: 'Easyrig', model: 'Minimax', category: 'Support', subcategory: 'Vest', description: 'For lighter cameras.', specs: { payload_kg: 7 }, daily_rate_est: 80 },

    // POWER & BATTERIES
    { id: 'pow-ant-vmnt', name: 'Anton Bauer Titon 150 (V-Mount) Set', brand: 'Anton Bauer', model: 'Titon 150', category: 'Power', subcategory: 'Battery', description: '4x 150Wh Batteries + Quad Charger.', specs: {}, daily_rate_est: 100 },
    { id: 'pow-ant-gold', name: 'Anton Bauer Dionic XT90 (Gold) Set', brand: 'Anton Bauer', model: 'Dionic XT90', category: 'Power', subcategory: 'Battery', description: '4x 90Wh Batteries + Quad Charger.', specs: {}, daily_rate_est: 100 },
    { id: 'pow-core-neo', name: 'Core SWX NEO 150 (V-Mount) Set', brand: 'Core SWX', model: 'NEO 150', category: 'Power', subcategory: 'Battery', description: 'Smart batteries with LCD info.', specs: {}, daily_rate_est: 90 },

    // MEDIA
    { id: 'med-arri-codex', name: 'ARRI Codex Compact Drive 1TB', brand: 'ARRI', model: 'Compact Drive', category: 'Media', subcategory: 'Card', description: 'For Alexa 35 & Mini LF.', specs: {}, daily_rate_est: 100 },
    { id: 'med-red-cf', name: 'RED PRO CFexpress 660GB', brand: 'RED', model: 'CFexpress Type B', category: 'Media', subcategory: 'Card', description: 'For V-Raptor & Komodo-X.', specs: {}, daily_rate_est: 80 },
    { id: 'med-sony-ax', name: 'Sony AXS A1TS66 1TB', brand: 'Sony', model: 'AXS Memory', category: 'Media', subcategory: 'Card', description: 'For Venice 2 AXS-R7.', specs: {}, daily_rate_est: 150 },

    // MONITORING
    { id: 'mon-ultra7', name: 'SmallHD Ultra 7', brand: 'SmallHD', model: 'Ultra 7', category: 'Monitor', description: '2300 nit high-bright touchscreen.', specs: { weight_kg: 0.9 }, daily_rate_est: 175 },

    // SUPPORT
    { id: 'sup-oconnor-2575', name: 'OConnor 2575D Head', brand: 'OConnor', model: '2575D', category: 'Support', subcategory: 'Fluid Head', description: 'Ultimate fluid head for cinema cameras.', specs: { weight_kg: 10.4 }, daily_rate_est: 150 },
    { id: 'sup-sachtler-flow', name: 'Sachtler Flowtech 100 Legs', brand: 'Sachtler', model: 'Flowtech 100', category: 'Support', subcategory: 'Tripod Legs', description: 'Fast deploy carbon fiber legs.', specs: { weight_kg: 3.2 }, daily_rate_est: 50 },

    // LIGHTING
    // ARRI HMI (M-Series)
    {
        id: 'lit-arri-m18',
        name: 'ARRI M18',
        brand: 'ARRI',
        model: 'M18',
        category: 'Lighting',
        subcategory: 'HMI',
        description: '1.8kW Open Face HMI. Lens-less technology.',
        specs: { power_draw_w: 1800, weight_kg: 10.5, mount: 'Junior' },
        daily_rate_est: 250,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Spot 15°)', value: '22,950 Lux @ 7m' },
                    { label: 'Output (Flood 58°)', value: '2,245 Lux @ 7m' },
                    { label: 'Beam Angle', value: '20° - 60° (Continuously Variable)' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'Weight', value: '10.5 kg / 23.1 lbs' },
                    { label: 'IP Rating', value: 'IP23' }
                ]
            }
        ],
        image_url: '/equipment/arri-m18.png'
    },
    {
        id: 'lit-arri-m40',
        name: 'ARRI M40',
        brand: 'ARRI',
        model: 'M40',
        category: 'Lighting',
        subcategory: 'HMI',
        description: '4kW Open Face HMI.',
        specs: { power_draw_w: 4000, weight_kg: 19.0, mount: 'Junior' },
        daily_rate_est: 450,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Spot 18°)', value: '40,300 Lux @ 7m' },
                    { label: 'Output (Flood 52°)', value: '5,000 Lux @ 7m' },
                    { label: 'Beam Angle', value: '18° - 52° (Continuously Variable)' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'Weight', value: '19.0 kg / 41.9 lbs' },
                    { label: 'IP Rating', value: 'IP23' }
                ]
            }
        ],
        image_url: '/equipment/arri-m40.png'
    },
    {
        id: 'lit-arrimax-18',
        name: 'ARRIMAX 18/12',
        brand: 'ARRI',
        model: 'ARRIMAX 18/12',
        category: 'Lighting',
        subcategory: 'HMI',
        description: 'The ultimate HMI. 18kW/12kW PAR.',
        specs: { power_draw_w: 18000, weight_kg: 65, mount: 'Junior' },
        daily_rate_est: 1200,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Spot 15°)', value: '129,960 Lux @ 10m' },
                    { label: 'Output (Flood 50°)', value: '13,459 Lux @ 10m' },
                    { label: 'Beam Angle', value: '15° - 50° (Variable)' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'Weight', value: '65 kg / 143 lbs' },
                    { label: 'IP Rating', value: 'IP23' }
                ]
            }
        ],
        image_url: '/equipment/arrimax.png'
    },

    // ARRI SkyPanel (Classic)
    {
        id: 'lit-sky-s60',
        name: 'ARRI SkyPanel S60-C',
        brand: 'ARRI',
        model: 'S60-C',
        category: 'Lighting',
        subcategory: 'LED Panel',
        description: 'Soft light standard. RGBW.',
        specs: { power_draw_w: 400, weight_kg: 12.0, mount: 'Junior' },
        daily_rate_est: 300,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Standard Diff)', value: '1,233 Lux @ 3m (5600K)' },
                    { label: 'Output (Lite Diff)', value: '1,450 Lux @ 3m (5600K)' },
                    { label: 'Beam Angle', value: '105° (Half Peak Angle)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBW LED' },
                    { label: 'CCT Range', value: '2,800K - 10,000K' },
                    { label: 'CRI / TLCI', value: '>95 / >90' }
                ]
            }
        ],
        image_url: '/equipment/skypanel-s60.png'
    },
    {
        id: 'lit-sky-s30',
        name: 'ARRI SkyPanel S30-C',
        brand: 'ARRI',
        model: 'S30-C',
        category: 'Lighting',
        subcategory: 'LED Panel',
        description: 'Portable soft light. RGBW.',
        specs: { power_draw_w: 200, weight_kg: 7.0, mount: 'Baby' },
        daily_rate_est: 200,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Intensifier)', value: '282 Lux @ 5m (5600K)' },
                    { label: 'Beam Angle', value: '105° (Half Peak Angle)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBW LED' },
                    { label: 'CCT Range', value: '2,800K - 10,000K' },
                    { label: 'CRI / TLCI', value: '>95 / >91' }
                ]
            }
        ],
        image_url: '/equipment/skypanel-s30.png'
    },

    {
        id: 'lit-sky-x',
        name: 'ARRI SkyPanel X21',
        brand: 'ARRI',
        model: 'SkyPanel X21',
        category: 'Lighting',
        subcategory: 'LED Panel',
        description: 'High-output, all-weather (IP66) native soft & hard light LED panel.',
        specs: { power_draw_w: 800, weight_kg: 15, mount: 'Yoke' },
        daily_rate_est: 450,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Native)', value: '49,800 Lux @ 1m (5600K)' },
                    { label: 'Output (HyPer Optic)', value: '4,800 Lux @ 10m (5600K)' },
                    { label: 'Beam Angle', value: '11° (HyPer Optic), 107° (Soft), 121° (Open Face)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBACL Full Spectrum' },
                    { label: 'CCT Range', value: '1,500K - 20,000K' },
                    { label: 'CRI / TLCI', value: '90+ / 93' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'IP Rating', value: 'IP66 (All-Weather)' },
                    { label: 'Control', value: 'DMX, Art-Net, sACN, CRMX, Bluetooth 5.0' }
                ]
            },
            {
                title: 'Resources',
                items: [
                    { label: 'Manual', value: 'https://www.arri.com/en/lighting/led/skypanel-x' }
                ]
            }
        ],
        image_url: '/equipment/skypanel-x.png'
    },
    {
        id: 'lit-1200d',
        name: 'Aputure LS 1200d Pro',
        brand: 'Aputure',
        model: 'LS 1200d Pro',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Daylight LED powerhouse. 1200W output comparable to 1.6kW HMI.',
        specs: { mount: 'Bowens', power_draw_w: 1200, weight_kg: 8.9 },
        daily_rate_est: 250,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Narrow Hyper Reflector)', value: '83,100 Lux @ 3m' },
                    { label: 'Output (Medium Hyper Reflector)', value: '22,400 Lux @ 3m' },
                    { label: 'Output (Wide Hyper Reflector)', value: '13,010 Lux @ 3m' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'CCT', value: '5600K Daylight' },
                    { label: 'CRI / TLCI', value: '≥96 / ≥98' },
                    { label: 'SSI (D56)', value: '73' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'IP Rating', value: 'IP54 (Dust & Water Resistant)' },
                    { label: 'Max Power Draw', value: '1440W' }
                ]
            }
        ],
        image_url: '/equipment/aputure-1200d.png'
    },

    // --- EXPANSION: ADDITIONAL LIGHTING ---
    {
        id: 'lit-600d',
        name: 'Aputure LS 600d Pro',
        brand: 'Aputure',
        model: 'LS 600d Pro',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Industry standard daylight LED.',
        specs: { mount: 'Bowens', power_draw_w: 600, weight_kg: 4.6 },
        daily_rate_est: 150,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Native Hyper Reflector)', value: '8,500 Lux @ 3m (5600K)' },
                    { label: 'Output (F10 Fresnel Spot)', value: '29,300 Lux @ 3m' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'CCT', value: '5600K Daylight' },
                    { label: 'CRI / TLCI', value: '≥96 / ≥96' },
                    { label: 'SSI (D56)', value: '72' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'IP Rating', value: 'IP54' },
                    { label: 'Max Power Draw', value: '720W' }
                ]
            }
        ],
        image_url: '/equipment/aputure-600d.png'
    },
    {
        id: 'lit-600c',
        name: 'Aputure LS 600c Pro',
        brand: 'Aputure',
        model: 'LS 600c Pro',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Full Color RGBWW point source.',
        specs: { mount: 'Bowens', power_draw_w: 600, weight_kg: 5.8 },
        daily_rate_est: 180,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Hyper Reflector)', value: '4,150+ Lux @ 3m (5600K)' },
                    { label: 'Output (F10 Fresnel Spot)', value: '7,440 Lux @ 3m (5600K)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBWW' },
                    { label: 'CCT Range', value: '2,300K - 10,000K' },
                    { label: 'CRI / TLCI', value: '≥95 / ≥98' },
                    { label: 'SSI (D56)', value: '74' }
                ]
            }
        ],
        image_url: '/equipment/aputure-600c.png'
    },
    {
        id: 'lit-600x',
        name: 'Aputure LS 600x Pro',
        brand: 'Aputure',
        model: 'LS 600x Pro',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Bi-Color widespread standard.',
        specs: { mount: 'Bowens', power_draw_w: 600, weight_kg: 4.6 },
        daily_rate_est: 160,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Hyper Reflector)', value: '5,610 Lux @ 3m (5600K)' },
                    { label: 'Output (F10 Fresnel Spot)', value: '18,510 Lux @ 3m (5600K)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'Bi-Color' },
                    { label: 'CCT Range', value: '2,700K - 6,500K' },
                    { label: 'SSI (D56)', value: '74' }
                ]
            }
        ],
        image_url: '/equipment/aputure-600x.png'
    },
    {
        id: 'lit-300d',
        name: 'Aputure LS 300d II',
        brand: 'Aputure',
        model: 'LS 300d II',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Compact daylight puncher.',
        specs: { mount: 'Bowens', power_draw_w: 300, weight_kg: 3.0 },
        daily_rate_est: 80,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Reflector)', value: '45,000 Lux @ 1m' },
                    { label: 'Output (Fresnel 2X)', value: '80,000 Lux @ 1m' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'CCT', value: '5600K ±200K' },
                    { label: 'CRI / TLCI', value: '≥96 / ≥96' }
                ]
            }
        ],
        image_url: '/equipment/aputure-300d.png'
    },
    {
        id: 'lit-mc-pro',
        name: 'Aputure MC Pro (8-Light Kit)',
        brand: 'Aputure',
        model: 'MC Pro',
        category: 'Lighting',
        subcategory: 'LED Panel',
        description: 'Mini RGBWW utilitarian lights with case.',
        specs: { power_draw_w: 40 },
        daily_rate_est: 75,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output', value: '1,585 Lux @ 0.5m (5600K)' },
                    { label: 'Beam Angle', value: '45°' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBWW' },
                    { label: 'CRI / TLCI', value: '96 / 96' },
                    { label: 'SSI (D56)', value: '72' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'IP Rating', value: 'IP65 (Weather-Resistant)' },
                    { label: 'Mounting', value: 'Magnetic, 1/4-20"' }
                ]
            }
        ],
        image_url: '/equipment/aputure-mc.png'
    },

    {
        id: 'lit-kino-freestyle-21',
        name: 'Kino Flo FreeStyle 21',
        brand: 'Kino Flo',
        model: 'FreeStyle 21',
        category: 'Lighting',
        subcategory: 'LED Panel',
        description: 'Color-accurate soft light with removable panel.',
        specs: { power_draw_w: 150, weight_kg: 5.0, mount: 'Baby/Junior' },
        daily_rate_est: 180,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output', value: '2,409 Lux @ 1m' },
                    { label: 'Output', value: '288 Lux @ 3m' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBW' },
                    { label: 'CCT Range', value: '2,500K - 9,900K' },
                    { label: 'CRI / TLCI', value: '96 / 96' }
                ]
            }
        ],
        image_url: '/equipment/kino-freestyle.png'
    },

    {
        id: 'lit-dedo-dled7',
        name: 'Dedolight DLED7 Turbo',
        brand: 'Dedolight',
        model: 'DLED7',
        category: 'Lighting',
        subcategory: 'Focusing LED',
        description: 'Bi-Color focusing spot light.',
        specs: { power_draw_w: 90, weight_kg: 1.3, mount: 'Baby' },
        daily_rate_est: 100,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Check', value: 'Spot (8°): 15,400 Lux @ 1m' },
                    { label: 'Check', value: 'Flood (60°): 2,150 Lux @ 1m' },
                    { label: 'Focus Range', value: '8° - 60°' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'Bi-Color w/ Hyper Tape' },
                    { label: 'CCT Range', value: '2,700K - 6,500K' },
                    { label: 'CRI / TLCI', value: '96 / 96' }
                ]
            }
        ],
        image_url: '/equipment/dedo-dled7.png'
    },

    {
        id: 'lit-evoke-1200',
        name: 'Nanlux Evoke 1200',
        brand: 'Nanlux',
        model: 'Evoke 1200',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: '1.2kW Daylight LED, comparable to 1.8kW HMI.',
        specs: { mount: 'NL', power_draw_w: 1200, weight_kg: 6.9 },
        daily_rate_est: 220,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Reflector 45°)', value: '18,460 Lux @ 3m' },
                    { label: 'Beam Angle', value: '45° (Standard Reflector)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'CCT', value: '5600K Daylight' },
                    { label: 'CRI / TLCI', value: '96 / 97' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'IP Rating', value: 'IP54' },
                    { label: 'Weight', value: '6.94 kg / 15.3 lbs' }
                ]
            }
        ],
        image_url: '/equipment/evoke-1200.png'
    },
    {
        id: 'lit-evoke-2400',
        name: 'Nanlux Evoke 2400B',
        brand: 'Nanlux',
        model: 'Evoke 2400B',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Massive 2.4kW Bi-Color output.',
        specs: { mount: 'NL', power_draw_w: 2400, weight_kg: 15.0 },
        daily_rate_est: 450,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (Reflector 45°)', value: '41,910 Lux @ 3m (5600K)' },
                    { label: 'Beam Angle', value: '45° (Standard Reflector)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'Bi-Color' },
                    { label: 'CCT Range', value: '2,700K - 6,500K' },
                    { label: 'CRI / TLCI', value: '96 / 97' }
                ]
            },
            {
                title: 'Physical',
                items: [
                    { label: 'IP Rating', value: 'IP55' },
                    { label: 'Weight', value: '15 kg / 33 lbs' }
                ]
            }
        ],
        image_url: '/equipment/evoke-2400.png'
    },

    {
        id: 'lit-astera-titan',
        name: 'Astera Titan Tube (8-Kit)',
        brand: 'Astera',
        model: 'Titan Tube',
        category: 'Lighting',
        subcategory: 'Tube',
        description: 'The gold standard for wireless pixel tubes.',
        specs: { power_draw_w: 72, length: '1035mm' },
        daily_rate_est: 250,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output', value: '785 Lux @ 1m (4000K)' },
                    { label: 'Beam / Field Angle', value: '120° / 180°' },
                    { label: 'Pixels', value: '16 Individual Pixels' }
                ]
            },
            {
                title: 'Power & Battery',
                items: [
                    { label: 'Battery Runtime', value: 'Max 20h' },
                    { label: 'Runtime (Max Brightness)', value: '1h 45m' },
                    { label: 'Charging Time', value: '3h' }
                ]
            },
            {
                title: 'Color & Control',
                items: [
                    { label: 'Engine', value: 'RGBMintAmber' },
                    { label: 'CRI / TLCI', value: '≥96 / ≥96' },
                    { label: 'IP Rating', value: 'IP65' }
                ]
            }
        ],
        image_url: '/equipment/astera-titan.png'
    },
    {
        id: 'lit-astera-helios',
        name: 'Astera Helios Tube (8-Kit)',
        brand: 'Astera',
        model: 'Helios Tube',
        category: 'Lighting',
        subcategory: 'Tube',
        description: 'Half-length wireless pixel tubes.',
        specs: { power_draw_w: 36, length: '550mm' },
        daily_rate_est: 200,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output', value: '393 Lux @ 1m (4000K)' },
                    { label: 'Beam / Field Angle', value: '120° / 180°' },
                    { label: 'Pixels', value: '8 Individual Pixels' }
                ]
            },
            {
                title: 'Power & Battery',
                items: [
                    { label: 'Battery Runtime', value: 'Max 20h' },
                    { label: 'Runtime (Max Brightness)', value: '1h 45m' }
                ]
            },
            {
                title: 'Color & Control',
                items: [
                    { label: 'IP Rating', value: 'IP65' },
                    { label: 'Control', value: 'Wireless DMX (CRMX), Infrared' }
                ]
            }
        ],
        image_url: '/equipment/astera-helios.png'
    },
    {
        id: 'lit-astera-nyx',
        name: 'Astera NYX Bulb (8-Kit)',
        brand: 'Astera',
        model: 'NYX Bulb',
        category: 'Lighting',
        subcategory: 'Bulb',
        description: 'Practical LED bulbs with full CRMX control.',
        specs: { power_draw_w: 10, mount: 'E27' },
        daily_rate_est: 80,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output', value: '750 Lumens (4000K)' },
                    { label: 'Colors', value: 'RGBMintAmber' },
                    { label: 'CRI / TLCI', value: '≥96 / ≥96' }
                ]
            },
            {
                title: 'Features',
                items: [
                    { label: 'Control', value: 'CRMX, Bluetooth, RF' },
                    { label: 'Power', value: 'AC (E26/E27) or DC via PowerStation' }
                ]
            }
        ],
        image_url: '/equipment/astera-nyx.png'
    },

    {
        id: 'lit-arri-orbiter',
        name: 'ARRI Orbiter',
        brand: 'ARRI',
        model: 'Orbiter',
        category: 'Lighting',
        subcategory: 'COB LED',
        description: 'Directional LED with changeable optics (QLM).',
        specs: { mount: 'QLM', power_draw_w: 400, weight_kg: 4.6 },
        daily_rate_est: 250,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output (30° Optic)', value: '44,700 Lux @ 1m (3200K)' },
                    { label: 'Output (30° Optic)', value: '58,000 Lux @ 1m (5600K)' },
                    { label: 'Beam Angle', value: 'Changeable (15°, 30°, 60°, Dome, Projection)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'ARRI Spectra 6-Color (RGBACL)' },
                    { label: 'CCT Range', value: '2,000K - 20,000K' },
                    { label: 'CRI / TLCI', value: '98 / 95' }
                ]
            },
            {
                title: 'Features',
                items: [
                    { label: 'Mount', value: 'QLM (Quick Lighting Mount)' },
                    { label: 'Sensors', value: 'Color Sensor Mode (Matches ambient light)' }
                ]
            }
        ],
        image_url: '/equipment/orbiter.png'
    },
    {
        id: 'lit-arri-l7c',
        name: 'ARRI L7-C LE2',
        brand: 'ARRI',
        model: 'L7-C',
        category: 'Lighting',
        subcategory: 'Fresnel',
        description: 'RGBW LED Fresnel with tuneable white and color.',
        specs: { power_draw_w: 160, weight_kg: 8.2 },
        daily_rate_est: 120,
        technical_data: [
            {
                title: 'Photometrics',
                items: [
                    { label: 'Output', value: 'Comparable to 1000W Tungsten' },
                    { label: 'Beam Angle', value: '15° - 50° (Zoomable Fresnel)' }
                ]
            },
            {
                title: 'Color Engine',
                items: [
                    { label: 'Type', value: 'RGBW LED' },
                    { label: 'CCT Range', value: '2,800K - 10,000K' }
                ]
            }
        ],
        image_url: '/equipment/l7c.png'
    },

    // --- EXPANSION: MONITORING ---
    { id: 'mon-cine13', name: 'SmallHD Cine 13', brand: 'SmallHD', model: 'Cine 13', category: 'Monitor', subcategory: 'Production', description: '4K High-Bright production monitor.', specs: { size: '13"', nit: 1500 }, daily_rate_est: 250 },
    { id: 'mon-cine24', name: 'SmallHD Cine 24', brand: 'SmallHD', model: 'Cine 24', category: 'Monitor', subcategory: 'Production', description: '4K High-Bright village monitor.', specs: { size: '24"', nit: 1350 }, daily_rate_est: 350 },
    { id: 'mon-indie7', name: 'SmallHD Indie 7', brand: 'SmallHD', model: 'Indie 7', category: 'Monitor', subcategory: 'On-Camera', description: 'Lightweight touchscreen monitor.', specs: { size: '7"', nit: 1000 }, daily_rate_est: 90 },
    { id: 'mon-fsi-dm240', name: 'Flanders DM240', brand: 'Flanders Scientific', model: 'DM240', category: 'Monitor', subcategory: 'Reference', description: 'Industry standard color accurate LCD.', specs: { size: '24"' }, daily_rate_est: 250 },
    { id: 'mon-fsi-dm170', name: 'Flanders DM170', brand: 'Flanders Scientific', model: 'DM170', category: 'Monitor', subcategory: 'Reference', description: 'Field rugged color critical monitor.', specs: { size: '17"' }, daily_rate_est: 175 },

    // --- EXPANSION: GRIP & SUPPORT ---
    { id: 'sup-ronin-4d', name: 'DJI Ronin 4D 6K', brand: 'DJI', model: 'Ronin 4D', category: 'Camera', subcategory: 'Gimbal Camera', description: 'Cinematography camera with built-in 4-axis stabilization.', specs: { sensor_size: '36x24', sensor_coverage: 'FF', mount: 'DL/E/M/PL', resolution: '6K' }, daily_rate_est: 350 },
    { id: 'sup-rs3-pro', name: 'DJI RS3 Pro Combo', brand: 'DJI', model: 'RS3 Pro', category: 'Support', subcategory: 'Gimbal', description: 'Heavy payload handheld gimbal.', specs: { payload_kg: 4.5 }, daily_rate_est: 110 },

    { id: 'sup-dana-dolly', name: 'Dana Dolly Universal Kit', brand: 'Dana Dolly', model: 'Universal Kit', category: 'Support', subcategory: 'Dolly', description: 'Portable dolly system for any size pipe.', specs: {}, daily_rate_est: 80 },
    { id: 'sup-slider-4ft', name: 'The Slider 4ft', brand: 'Ronford Baker', model: '4ft Slider', category: 'Support', subcategory: 'Slider', description: 'Heavy duty high precision slider.', specs: { length: '4ft' }, daily_rate_est: 150 },

    { id: 'sup-sachtler-18', name: 'Sachtler Video 18 S2', brand: 'Sachtler', model: 'Video 18 S2', category: 'Support', subcategory: 'Tripod', description: 'Standard EFP/ENG tripod system.', specs: { payload_kg: 22 }, daily_rate_est: 80 },
    { id: 'sup-sachtler-20', name: 'Sachtler Video 20 S1', brand: 'Sachtler', model: 'Video 20 S1', category: 'Support', subcategory: 'Tripod', description: 'Higher payload standard tripod.', specs: { payload_kg: 25 }, daily_rate_est: 95 },
    { id: 'sup-oconnor-1030', name: 'OConnor 1030D', brand: 'OConnor', model: '1030D', category: 'Support', subcategory: 'Fluid Head', description: 'Lightweight version of the 2575.', specs: { payload_kg: 13.6 }, daily_rate_est: 120 },

    // --- EXPANSION: AUDIO ---
    { id: 'aud-senn-mkh416', name: 'Sennheiser MKH 416', brand: 'Sennheiser', model: 'MKH 416', category: 'Audio', subcategory: 'Microphone', description: 'Industry standard shotgun mic.', specs: { type: 'Shotgun' }, daily_rate_est: 40 },
    { id: 'aud-zoom-f8', name: 'Zoom F8n Pro', brand: 'Zoom', model: 'F8n Pro', category: 'Audio', subcategory: 'Recorder', description: '8-channel field recorder.', specs: { channels: 8 }, daily_rate_est: 60 },
    { id: 'aud-wisy-mcr54', name: 'Wisycom MCR54 Kit', brand: 'Wisycom', model: 'MCR54', category: 'Audio', subcategory: 'Wireless', description: '4-channel true diversity wireless receiver.', specs: { channels: 4 }, daily_rate_est: 150 },

    { id: 'lens-cooke-s8-18', name: 'Cooke S8/i FF 18mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '18mm', aperture: 'T1.4', weight_kg: 2.6, close_focus_m: 0.35, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-21', name: 'Cooke S8/i FF 21mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '21mm', aperture: 'T1.4', weight_kg: 2.4, close_focus_m: 0.35, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-25', name: 'Cooke S8/i FF 25mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '25mm', aperture: 'T1.4', weight_kg: 2.2, close_focus_m: 0.35, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-27', name: 'Cooke S8/i FF 27mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '27mm', aperture: 'T1.4', weight_kg: 2.3, close_focus_m: 0.35, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-32', name: 'Cooke S8/i FF 32mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '32mm', aperture: 'T1.4', weight_kg: 2.1, close_focus_m: 0.35, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-35', name: 'Cooke S8/i FF 35mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '35mm', aperture: 'T1.4', weight_kg: 2.0, close_focus_m: 0.35, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-40', name: 'Cooke S8/i FF 40mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '40mm', aperture: 'T1.4', weight_kg: 2.0, close_focus_m: 0.40, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-50', name: 'Cooke S8/i FF 50mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '50mm', aperture: 'T1.4', weight_kg: 2.1, close_focus_m: 0.50, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-65', name: 'Cooke S8/i FF 65mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '65mm', aperture: 'T1.4', weight_kg: 2.3, close_focus_m: 0.65, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-75', name: 'Cooke S8/i FF 75mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '75mm', aperture: 'T1.4', weight_kg: 2.3, close_focus_m: 0.75, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-100', name: 'Cooke S8/i FF 100mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '100mm', aperture: 'T1.4', weight_kg: 2.5, close_focus_m: 0.90, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 550 },
    { id: 'lens-cooke-s8-135', name: 'Cooke S8/i FF 135mm T1.4', brand: 'Cooke', model: 'S8/i FF', category: 'Lens', subcategory: 'Prime', description: 'T1.4 Full Frame Cine Prime. The Cooke Look.', specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '135mm', aperture: 'T1.4', weight_kg: 3.0, close_focus_m: 1.1, front_diameter_mm: 110, image_circle_mm: 46.3 }, daily_rate_est: 600 },

    // Angenieux Zooms
    // EZ Series (Versatile S35/FF)
    {
        id: 'lens-ang-ez1',
        name: 'Angenieux EZ-1 30-90mm T2.0 (S35) / 45-135mm T3.0 (FF)',
        brand: 'Angenieux',
        model: 'EZ-1',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'Convertible Super 35 / Full Frame zoom. Standard PL mount.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '30-90mm (S35) / 45-135mm (FF)', aperture: 'T2.0 (S35) / T3.0 (FF)', weight_kg: 2.15, close_focus_m: 0.6, front_diameter_mm: 114 },
        daily_rate_est: 350
    },
    {
        id: 'lens-ang-ez2',
        name: 'Angenieux EZ-2 15-40mm T2.0 (S35) / 22-60mm T3.0 (FF)',
        brand: 'Angenieux',
        model: 'EZ-2',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'Convertible Super 35 / Full Frame wide zoom.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '15-40mm (S35) / 22-60mm (FF)', aperture: 'T2.0 (S35) / T3.0 (FF)', weight_kg: 2.12, close_focus_m: 0.6, front_diameter_mm: 114 },
        daily_rate_est: 350
    },
    // Optimo Ultra 12x (High End)
    {
        id: 'lens-ang-optimo-12x',
        name: 'Angenieux Optimo Ultra 12x (FF/VV)',
        brand: 'Angenieux',
        model: 'Optimo Ultra 12x',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'The industry reference long zoom. Configured for Full Frame (36-435mm T4.2).',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '36-435mm', aperture: 'T4.2', weight_kg: 12.75, close_focus_m: 1.5, front_diameter_mm: 162 },
        daily_rate_est: 1200
    },
    // Optimo Style (Compact)
    {
        id: 'lens-ang-optimo-style-25-250',
        name: 'Angenieux Optimo Style 25-250mm T3.5',
        brand: 'Angenieux',
        model: 'Optimo Style',
        category: 'Lens',
        subcategory: 'Zoom',
        description: '10x Zoom range (Super 35).',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '25-250mm', aperture: 'T3.5', weight_kg: 7.3, close_focus_m: 1.2, front_diameter_mm: 136 },
        daily_rate_est: 650
    },
    {
        id: 'lens-ang-optimo-style-16-40',
        name: 'Angenieux Optimo Style 16-40mm T2.8',
        brand: 'Angenieux',
        model: 'Optimo Style',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'lightweight wide zoom (Super 35).',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '16-40mm', aperture: 'T2.8', weight_kg: 1.9, close_focus_m: 0.6, front_diameter_mm: 114 },
        daily_rate_est: 300
    },
    {
        id: 'lens-ang-optimo-style-30-76',
        name: 'Angenieux Optimo Style 30-76mm T2.8',
        brand: 'Angenieux',
        model: 'Optimo Style',
        category: 'Lens',
        subcategory: 'Zoom',
        description: 'Lightweight standard zoom (Super 35).',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '30-76mm', aperture: 'T2.8', weight_kg: 1.9, close_focus_m: 0.6, front_diameter_mm: 114 },
        daily_rate_est: 300
    },

    // --- ZEISS Supreme Primes (Full Frame T1.5) ---
    {
        id: 'lens-zeiss-sp-15',
        name: 'Zeiss Supreme Prime 15mm T1.8',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime. Consistent coverage and look.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '15mm', aperture: 'T1.8', weight_kg: 2.2, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-18',
        name: 'Zeiss Supreme Prime 18mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '18mm', aperture: 'T1.5', weight_kg: 2.3, close_focus_m: 0.35, front_diameter_mm: 114, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-21',
        name: 'Zeiss Supreme Prime 21mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '21mm', aperture: 'T1.5', weight_kg: 1.6, close_focus_m: 0.35, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-25',
        name: 'Zeiss Supreme Prime 25mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '25mm', aperture: 'T1.5', weight_kg: 1.7, close_focus_m: 0.26, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-29',
        name: 'Zeiss Supreme Prime 29mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '29mm', aperture: 'T1.5', weight_kg: 1.8, close_focus_m: 0.33, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-35',
        name: 'Zeiss Supreme Prime 35mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '35mm', aperture: 'T1.5', weight_kg: 1.4, close_focus_m: 0.32, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-40',
        name: 'Zeiss Supreme Prime 40mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '40mm', aperture: 'T1.5', weight_kg: 1.5, close_focus_m: 0.29, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-50',
        name: 'Zeiss Supreme Prime 50mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '50mm', aperture: 'T1.5', weight_kg: 1.2, close_focus_m: 0.45, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-65',
        name: 'Zeiss Supreme Prime 65mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '65mm', aperture: 'T1.5', weight_kg: 1.6, close_focus_m: 0.6, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-85',
        name: 'Zeiss Supreme Prime 85mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '85mm', aperture: 'T1.5', weight_kg: 1.4, close_focus_m: 0.84, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-100',
        name: 'Zeiss Supreme Prime 100mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '100mm', aperture: 'T1.5', weight_kg: 1.7, close_focus_m: 1.0, front_diameter_mm: 95, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },
    {
        id: 'lens-zeiss-sp-135',
        name: 'Zeiss Supreme Prime 135mm T1.5',
        brand: 'Zeiss',
        model: 'Supreme Prime',
        category: 'Lens',
        subcategory: 'Spherical',
        description: 'High speed full frame prime.',
        specs: { sensor_coverage: 'FF' as const, mount: 'PL', focal_length: '135mm', aperture: 'T1.5', weight_kg: 2.2, close_focus_m: 1.3, front_diameter_mm: 114, image_circle_mm: 46.3 },
        daily_rate_est: 450
    },

    // --- ATLAS Orion Series (Anamorphic 2x) ---
    {
        id: 'lens-atlas-orion-21',
        name: 'Atlas Orion 21mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Widest anamorphic in the series. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '21mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.9, close_focus_m: 0.45, front_diameter_mm: 136 },
        daily_rate_est: 300
    },
    {
        id: 'lens-atlas-orion-25',
        name: 'Atlas Orion 25mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Wide anamorphic. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '25mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.3, close_focus_m: 0.45, front_diameter_mm: 114 },
        daily_rate_est: 300
    },
    {
        id: 'lens-atlas-orion-32',
        name: 'Atlas Orion 32mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Series A wide. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '32mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.2, close_focus_m: 0.53, front_diameter_mm: 114 },
        daily_rate_est: 250
    },
    {
        id: 'lens-atlas-orion-40',
        name: 'Atlas Orion 40mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Series A standard. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '40mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.2, close_focus_m: 0.56, front_diameter_mm: 114 },
        daily_rate_est: 250
    },
    {
        id: 'lens-atlas-orion-50',
        name: 'Atlas Orion 50mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Series B standard. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '50mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.2, close_focus_m: 0.84, front_diameter_mm: 114 },
        daily_rate_est: 250
    },
    {
        id: 'lens-atlas-orion-65',
        name: 'Atlas Orion 65mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Series A portrait. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '65mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.2, close_focus_m: 0.84, front_diameter_mm: 114 },
        daily_rate_est: 250
    },
    {
        id: 'lens-atlas-orion-80',
        name: 'Atlas Orion 80mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Series B portrait. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '80mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.2, close_focus_m: 1.06, front_diameter_mm: 114 },
        daily_rate_est: 250
    },
    {
        id: 'lens-atlas-orion-100',
        name: 'Atlas Orion 100mm T2.0',
        brand: 'Atlas Lens Co.',
        model: 'Orion Series',
        category: 'Lens',
        subcategory: 'Anamorphic',
        description: 'Series A tele. 2x squeeze.',
        specs: { sensor_coverage: 'S35' as const, mount: 'PL', focal_length: '100mm', aperture: 'T2.0', squeeze: '2x', weight_kg: 2.2, close_focus_m: 1.06, front_diameter_mm: 114 },
        daily_rate_est: 250
    }
];

export const accessoryData = [
    // --- CAMERA ACCESSORIES ---
    {
        id: 'acc-rialto-venice',
        name: 'Sony Rialto Extension',
        brand: 'Sony',
        model: 'CBK-3610XS',
        category: 'Support',
        subcategory: 'Camera Accessory',
        description: 'Extension system for Venice. Separates sensor block from camera body.',
        specs: { weight_kg: 0.8, compatible_cameras: ['cam-sony-venice-1', 'cam-sony-venice-2-8k', 'cam-sony-venice-2-6k'] },
        daily_rate_est: 200
    },
    {
        id: 'acc-rialto-cable-2m',
        name: 'Rialto Cable 2m',
        brand: 'Sony',
        model: 'Extension Cable',
        category: 'Support',
        subcategory: 'Camera Accessory',
        description: '2 meter extension cable for Rialto system.',
        specs: { length_m: 2, compatible_cameras: ['cam-sony-venice-1', 'cam-sony-venice-2-8k', 'cam-sony-venice-2-6k'] },
        daily_rate_est: 50
    },
    {
        id: 'acc-codex-drive-1tb',
        name: 'Codex Drive 1TB',
        brand: 'Codex',
        model: 'Compact Drive',
        category: 'Support',
        subcategory: 'Media',
        description: 'Recording media for ARRI cameras.',
        specs: { capacity_tb: 1, weight_kg: 0.3, compatible_cameras: ['cam-arri-35', 'cam-arri-35-xtreme', 'cam-arri-mini-lf', 'cam-arri-lf'] },
        daily_rate_est: 80
    },
    {
        id: 'acc-red-cfexpress-1tb',
        name: 'RED CFexpress 1TB',
        brand: 'RED',
        model: 'PRO CFexpress',
        category: 'Support',
        subcategory: 'Media',
        description: 'High-speed recording media for RED cameras.',
        specs: { capacity_tb: 1, weight_kg: 0.1, compatible_cameras: ['cam-red-raptor-x', 'cam-red-vraptor-8k', 'cam-red-komodo-x', 'cam-red-komodo'] },
        daily_rate_est: 60
    },
    {
        id: 'acc-vmount-150wh',
        name: 'V-Mount 150Wh',
        brand: 'Anton Bauer',
        model: 'Titon 150',
        category: 'Support',
        subcategory: 'Batteries',
        description: 'High capacity V-mount battery.',
        specs: { capacity_wh: 150, weight_kg: 0.9, compatible_cameras: ['*'] },
        daily_rate_est: 25
    }
];
