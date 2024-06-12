/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/directed_stake.json`.
 */
export type DirectedStake = {
    address: 'DStkUE3DjxBhVwEGNzv89eni1p7LpYuHSxxm1foggbEv';
    metadata: {
        name: 'directedStake';
        version: '0.1.0';
        spec: '0.1.0';
        description: 'Directed stake program';
    };
    instructions: [
        {
            name: 'closeDirector';
            docs: ['Closes the [Director] for the account.'];
            discriminator: [243, 34, 127, 33, 93, 202, 96, 47];
            accounts: [
                {
                    name: 'authority';
                    docs: ['Owner of the [Director].'];
                    signer: true;
                },
                {
                    name: 'director';
                    docs: ['The [Director].'];
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [100, 105, 114, 101, 99, 116, 111, 114];
                            },
                            {
                                kind: 'account';
                                path: 'authority';
                            },
                        ];
                    };
                },
                {
                    name: 'rentDestination';
                    docs: ['Where to send the rent to for the closed account.'];
                    writable: true;
                },
            ];
            args: [];
        },
        {
            name: 'initDirector';
            docs: ['Initializes a [Director] for a new account.'];
            discriminator: [187, 176, 215, 229, 47, 249, 190, 199];
            accounts: [
                {
                    name: 'authority';
                    docs: ['Owner of the [Director].'];
                    signer: true;
                },
                {
                    name: 'director';
                    docs: ['The [Director].'];
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [100, 105, 114, 101, 99, 116, 111, 114];
                            },
                            {
                                kind: 'account';
                                path: 'authority';
                            },
                        ];
                    };
                },
                {
                    name: 'payer';
                    docs: ['Payer.'];
                    writable: true;
                    signer: true;
                },
                {
                    name: 'systemProgram';
                    docs: ['System program. Required for initialization.'];
                    address: '11111111111111111111111111111111';
                },
            ];
            args: [];
        },
        {
            name: 'setStakeTarget';
            docs: ["Sets the [Director]'s stake target."];
            discriminator: [82, 172, 106, 255, 106, 24, 153, 243];
            accounts: [
                {
                    name: 'authority';
                    signer: true;
                },
                {
                    name: 'director';
                    writable: true;
                    pda: {
                        seeds: [
                            {
                                kind: 'const';
                                value: [100, 105, 114, 101, 99, 116, 111, 114];
                            },
                            {
                                kind: 'account';
                                path: 'authority';
                            },
                        ];
                    };
                },
                {
                    name: 'stakeTarget';
                    docs: ['The vote account [Pubkey] of the validator.'];
                },
                {
                    name: 'clock';
                    docs: ['The [Clock].'];
                    address: 'SysvarC1ock11111111111111111111111111111111';
                },
            ];
            args: [];
        },
    ];
    accounts: [
        {
            name: 'director';
            discriminator: [220, 1, 17, 212, 58, 16, 231, 102];
        },
    ];
    errors: [
        {
            code: 6000;
            name: 'invalidTimestamp';
            msg: 'Invalid timestamp.';
        },
    ];
    types: [
        {
            name: 'director';
            serialization: 'bytemuck';
            repr: {
                kind: 'c';
            };
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'stakeTarget';
                        type: 'pubkey';
                    },
                    {
                        name: 'lastUpdatedAt';
                        type: 'u64';
                    },
                ];
            };
        },
    ];
};

export const directedStakeIdl = {
    address: 'DStkUE3DjxBhVwEGNzv89eni1p7LpYuHSxxm1foggbEv',
    metadata: {
        name: 'directed_stake',
        version: '0.1.0',
        spec: '0.1.0',
        description: 'Directed stake program',
    },
    instructions: [
        {
            name: 'close_director',
            docs: ['Closes the [Director] for the account.'],
            discriminator: [243, 34, 127, 33, 93, 202, 96, 47],
            accounts: [
                {
                    name: 'authority',
                    docs: ['Owner of the [Director].'],
                    signer: true,
                },
                {
                    name: 'director',
                    docs: ['The [Director].'],
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [100, 105, 114, 101, 99, 116, 111, 114],
                            },
                            {
                                kind: 'account',
                                path: 'authority',
                            },
                        ],
                    },
                },
                {
                    name: 'rent_destination',
                    docs: ['Where to send the rent to for the closed account.'],
                    writable: true,
                },
            ],
            args: [],
        },
        {
            name: 'init_director',
            docs: ['Initializes a [Director] for a new account.'],
            discriminator: [187, 176, 215, 229, 47, 249, 190, 199],
            accounts: [
                {
                    name: 'authority',
                    docs: ['Owner of the [Director].'],
                    signer: true,
                },
                {
                    name: 'director',
                    docs: ['The [Director].'],
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [100, 105, 114, 101, 99, 116, 111, 114],
                            },
                            {
                                kind: 'account',
                                path: 'authority',
                            },
                        ],
                    },
                },
                {
                    name: 'payer',
                    docs: ['Payer.'],
                    writable: true,
                    signer: true,
                },
                {
                    name: 'system_program',
                    docs: ['System program. Required for initialization.'],
                    address: '11111111111111111111111111111111',
                },
            ],
            args: [],
        },
        {
            name: 'set_stake_target',
            docs: ["Sets the [Director]'s stake target."],
            discriminator: [82, 172, 106, 255, 106, 24, 153, 243],
            accounts: [
                {
                    name: 'authority',
                    signer: true,
                },
                {
                    name: 'director',
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: 'const',
                                value: [100, 105, 114, 101, 99, 116, 111, 114],
                            },
                            {
                                kind: 'account',
                                path: 'authority',
                            },
                        ],
                    },
                },
                {
                    name: 'stake_target',
                    docs: ['The vote account [Pubkey] of the validator.'],
                },
                {
                    name: 'clock',
                    docs: ['The [Clock].'],
                    address: 'SysvarC1ock11111111111111111111111111111111',
                },
            ],
            args: [],
        },
    ],
    accounts: [
        {
            name: 'Director',
            discriminator: [220, 1, 17, 212, 58, 16, 231, 102],
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'InvalidTimestamp',
            msg: 'Invalid timestamp.',
        },
    ],
    types: [
        {
            name: 'Director',
            serialization: 'bytemuck',
            repr: {
                kind: 'c',
            },
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'stake_target',
                        type: 'pubkey',
                    },
                    {
                        name: 'last_updated_at',
                        type: 'u64',
                    },
                ],
            },
        },
    ],
};