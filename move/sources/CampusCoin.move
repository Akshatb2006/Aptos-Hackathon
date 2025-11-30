module campus_wallet::campus_coin {
    use std::signer;
    use std::string;
    use aptos_framework::coin;
    use aptos_framework::account;

    struct CampusCoin {}

    struct Capabilities has key {
        mint_cap: coin::MintCapability<CampusCoin>,
        burn_cap: coin::BurnCapability<CampusCoin>,
        freeze_cap: coin::FreezeCapability<CampusCoin>,
    }

    public entry fun initialize(admin: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<CampusCoin>(
            admin,
            string::utf8(b"Campus Coin"),
            string::utf8(b"CAMP"),
            8,
            true,
        );

        move_to(admin, Capabilities {
            mint_cap,
            burn_cap,
            freeze_cap,
        });
    }

    public entry fun register(account: &signer) {
        coin::register<CampusCoin>(account);
    }

    public entry fun mint(admin: &signer, recipient: address, amount: u64) acquires Capabilities {
        let caps = borrow_global<Capabilities>(signer::address_of(admin));
        let coins = coin::mint(amount, &caps.mint_cap);
        coin::deposit(recipient, coins);
    }

    public entry fun burn(admin: &signer, amount: u64) acquires Capabilities {
        let caps = borrow_global<Capabilities>(signer::address_of(admin));
        let coins = coin::withdraw<CampusCoin>(admin, amount);
        coin::burn(coins, &caps.burn_cap);
    }

}
