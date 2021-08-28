class GuildConfigs extends BitField {
    any(permission, checkAdmin = true) {
        return (super.any(permission));
    }
  
    has(permission, checkAdmin = true) {
        return (super.has(permission));
    }

    static get FLAGS() {
        const FLAGS = {
            MANDATORY_REASON: 1 << 0,
            LOG_UNBAN: 1 << 1,
            LOG_UNMUTE: 1 << 2,
            LOG_EVENTS: 1 << 3
        }

        return FLAGS
    }

    static get ALL() {
        return Object.values(GuildConfigs.FLAGS).reduce((all, p) => all | p, 0)
    }

    static get DEFAULT() {
        return 0
    }

    static get defaultBit() {
        return 0
    }
}