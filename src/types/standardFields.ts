export const FIELD_DEFINITIONS = {
    Led: [
        {
            label: 'Colour Temperature (K)', name: 'colour Temperature', type: 'select', options: [
                { label: '2700K', value: '27000K' },
                { label: '3000K', value: '30000K' },
                { label: '4000K', value: '40000K' }
            ], rule: true
        },
        { label: 'LED Part No', name: 'led Part No', type: 'input', rule: true }
    ],
    'Optic set': [
        { label: 'LOR', name: 'lor', type: 'input', rule: true },
        { label: 'Primary Beam Angle', name: 'primary Beam Angle', type: 'input', rule: true }
    ],
    Engine: [
        { label: 'LED Lifetime', name: 'led Lifetime', type: 'input', rule: false },
        { label: 'Maximum Drive Current (mA)', name: 'maximum Drive Current', type: 'input', rule: false },
        { label: 'Minimum Drive Current (mA)', name: 'minimum Drive Current', type: 'input', rule: false }
    ]
} satisfies Record<string, { label: string; name: string; type: 'input' | 'select'; options?: any[]; rule: boolean }[]>;
