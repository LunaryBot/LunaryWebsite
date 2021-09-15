const content = $("#content")
const guild = JSON.parse($("#guild-data").html())
const guildDB = JSON.parse($("#guild-db-data").html())
const guildConfigs = new GuildConfigs(guildDB.configs || 0)

content.html(content.html() + `
    <div class="card">
        <div class="card-title">
            <h3><strong><i class="fas fa-cog"></i> GERAL</strong></h3>
        </div>
        <div class="card-content">
            <div class="check-radio">
                <input type="checkbox" name="mandatory_reason" id="mandatory_reason" ${guildConfigs.has("MANDATORY_REASON") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Tornar motivo para punições obrigatório</strong></label>
                <p>Permitir que uma punição usando o bot(Lunar) só seja efetuada com um motivo especificado.<br>Essa opção só ira ser aplicada para usuários que não possuem um cargo com a permissão <code>Punir sem motivo</code>.</p>
            </div>
            <hr>
            <br>
            <div class="check-radio">
                <input type="checkbox" name="log_unban" id="log_unban" ${guildConfigs.has("LOG_UNBAN") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Registrar evento Unban</strong></label>
                <p>Registrar no canal de modlogs quando um banimento for retirado.<br>Para mostrar o motivo e o autor, você precisa dar ao bot permissão de <code>Ver registro de autoria</code>.</p>
            </div>
            <hr>
            <br>
            <div class="check-radio">
                <input type="checkbox" name="log_unmute" id="log_unmute" ${guildConfigs.has("LOG_UNMUTE") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Registrar evento Unmute</strong></label>
                <p>Registrar no canal de punições quando um silenciamento for retirado.</p>
            </div>
            <hr>
            <br>
            <div class="check-radio">
                <input type="checkbox" name="log_events" id="log_events" ${guildConfigs.has("LOG_EVENTS") ? "checked" : ""} data-send-on-save bitfield /><label style="margin-left: 1%; font-size: 18px"><strong>Eventos de banimento de log não feitos através do bot(Lunar)</strong></label>
                <p>Registrar no canal de modlogs e punições quando um banimento for aplicado e não tenha sido feito pelo bot(Lunar).<br>Para mostrar o motivo e o autor, você precisa dar ao bot permissão de <code>Ver registro de autoria</code>.</p>
            </div>
        </div>
    </div>
    
    <div class="card">
        <div class="card-title">
            <h3><strong><i class="fas fa-volume-slash"></i> MUTE</strong></h3>
        </div>
        <div class="card-content">
            <label><strong>Cargo de mute:</strong></label><p style="margin-left: 3%; color: rgb(184, 184, 184)">Cargo que um usuário irá receber enquanto estiver mutado.<br>Se não estiver nenhum cargo selecionado o bot(Lunar) irá criar um.</p>
            <div class="select-wrapper" type="selectmenu" data-send-on-save>
                    <div class="select" id="chat_modlogs">
                        <div class="select__trigger"><p>${(function() {
                            let a = "Selecionar Cargo"
                            if(guildDB.muterole) {
                                const role = guild.roles.filter(x => !x.managed && x.id != guild.id).find(x => x.id == guildDB.muterole)
                                if(role) {
                                    a = role.name
                                }
                            }

                            return a
                        })()}</p>
                    </div>
                    <p class="select-menu-search"><input type="text" value="" autocomplete="off" placeholder="Nome/ID" name="search"><i class="icon fas fa-search"></i></p>
                    <div class="custom-options close" id="co-chat_modlogs">
                        <span class="custom-option ${!guildDB.muterole || !guild.roles.filter(x => !x.managed && x.id != guild.id).find(x => x.id == guildDB.muterole) ? "selected" : ""}" data-value="none" name="Selecionar Cargo">Nenhum</span>
                        ${guild.roles.filter(x => !x.managed && x.id != guild.id).sort((a, b) => b.rawPosition - a.rawPosition).map(function(role) {
                            return `<span class="custom-option ${guildDB.muterole && guildDB.muterole == role.id  ? "selected" : ""}" style="color: #${(role.color || 16777215).toString(16)};" data-value="${role.id}"> <p>${role.name}</p> </span>`
                        }).join("")}
                    </div>
                </div>
            </div>
            <hr>
            <br>
            <div class="check-radio">
                <input type="checkbox" name="remove_roles_in_mute" id="remove_roles_in_mute" data-send-on-save /><label style="margin-left: 1%; font-size: 18px"><strong>Remover cargos</strong></label><p>Remover os cargos do usuário durante o período de silenciamento e devolve-os quando o silenciamento terminar.</p>
            </div>
        </div>
    <div>

    <div class="card">
        <div class="card-title">
            <h3><strong><i class="fas fa-hashtag"></i> Canais de Logs</strong></h3>
        </div>
        <div class="card-content">
            <label><strong>Canal de modlogs:</strong></label>
            <div class="select-wrapper" type="selectmenu" data-send-on-save>
                <div class="select" id="chat_modlogs">
                    <div class="select__trigger"><p>${(function() {
                        let a = "Selecionar Canal"
                        if(guildDB.chat_modlogs) {
                            const channel = guild.channels.filter(x => ["GUILD_TEXT", "GUILD_NEWS"].includes(x.type)).find(x => x.id == guildDB.chat_modlogs)
                            if(channel) {
                                a = channel.name
                            }
                        }

                        return a
                    })()}</p>
                    </div>
                    <p class="select-menu-search"><input type="text" value="" autocomplete="off" placeholder="Nome/ID" name="search"><i class="icon fas fa-search"></i></p>
                    <div class="custom-options close" id="co-chat_modlogs">
                        <span class="custom-option ${!guildDB.chat_modlogs || !guild.channels.filter(x => ["GUILD_TEXT", "GUILD_NEWS"].includes(x.type)).find(x => x.id == guildDB.chat_modlogs) ? "selected" : ""}" data-value="none" name="Selecionar Cargo">Nenhum</span>
                        ${guild.channels.filter(x => ["GUILD_TEXT", "GUILD_NEWS"].includes(x.type)).sort((a, b) => a.rawPosition - b.rawPosition).map(function(channel) {
                            return `<span class="custom-option ${guildDB.chat_modlogs && guildDB.chat_modlogs == channel.id  ? "selected" : ""}" data-value="${channel.id}"> <p>${channel.name}</p> </span>`
                        }).join("")}
                    </div>
                </div>
             </div>
             <p style="margin-left: 3%; color: rgb(184, 184, 184)">Canal onde será enviado as mensagem de modlogs. <a href="https://ptb.discord.com/channels/869916717122469898/872881703520194621/880267224332513380"><code>Exemplo</code></a><br><code style="color: #00ff00">Mostra autor, usuário, motivo, id e link para log punição</code>, <br><code style="color: red;">Não mostra o gif de punição</code></p>
             <hr>
            <br>
            <label><strong>Canal de punições:</strong></label>
            <div class="select-wrapper" type="selectmenu" data-send-on-save>
                <div class="select" id="chat_punish">
                    <div class="select__trigger"><p>${(function() {
                        let a = "Selecionar Canal"
                        if(guildDB.chat_punish) {
                            const channel = guild.channels.filter(x => ["GUILD_TEXT", "GUILD_NEWS"].includes(x.type)).find(x => x.id == guildDB.chat_punish)
                            if(channel) {
                                a = channel.name
                            }
                        }

                        return a
                    })()}</p>
                    </div>
                    <p class="select-menu-search"><input type="text" value="" autocomplete="off" placeholder="Nome/ID" name="search"><i class="icon fas fa-search"></i></p>
                    <div class="custom-options close" id="co-chat_punish">
                        <span class="custom-option ${!guildDB.chat_punish || !guild.channels.filter(x => ["GUILD_TEXT", "GUILD_NEWS"].includes(x.type)).find(x => x.id == guildDB.chat_punish) ? "selected" : ""}" data-value="none" name="Selecionar Cargo">Nenhum</span>
                        ${guild.channels.filter(x => ["GUILD_TEXT", "GUILD_NEWS"].includes(x.type)).sort((a, b) => a.rawPosition - b.rawPosition).map(function(channel) {
                            return `<span class="custom-option ${guildDB.chat_punish && guildDB.chat_punish == channel.id  ? "selected" : ""}" data-value="${channel.id}"> <p>${channel.name}</p> </span>`
                        }).join("")}
                        </div>
                    </div>
                </div>
            <p style="margin-left: 3%; color: rgb(184, 184, 184)">Canal onde será enviado as mensagem de punições. <a href="https://ptb.discord.com/channels/869916717122469898/872881703520194621/880267224332513380"><code>Exemplo</code></a><br><code style="color: #00ff00">Mostra autor, usuário, motivo, e gif punição</code>, <br><code style="color: red;">Não mostra id e link de log da punição.</code></p>
        </div>
    </div>

    <div class="card-save" id="card-save"><strong style="color: rgb(184, 184, 184)">Salvar as alterações feitas</strong> <button class="bnt-save" onclick="save()"><strong>Salvar</strong></button></div>

    <script>
        $("[type]").map(function() {
            const a = $(this)
            if(a.attr("type") == "checkbox") {
                a.click(function() {
                    const cardsave = $("#card-save")
                    if(cardsave) cardsave.addClass("ok")
                })
            }
        })
    </script>
`)