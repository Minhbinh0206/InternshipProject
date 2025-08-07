export const partTypeFieldConfig: Record<string, string[]> = {
    Led: ['led Part No', 'colour Temperature'],
    'Optic set': ['lor', 'primary Beam Angle'],
    Engine: ['led Lifetime', 'maximum Drive Current', 'minimum Drive Current'],
};

export const getRequiredFields = (partType: string): string[] => {
    const baseFields = ['name', 'customerCode'];
    const extraFields = partTypeFieldConfig[partType] || [];
    return [...baseFields, ...extraFields];
};
