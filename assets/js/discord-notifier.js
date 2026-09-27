/**
 * DISCORD NOTIFIER - Need for Speed: Most Wanted (2005)
 * Conector oficial con el Webhook de Discord del Servidor de NFS MW Ranks
 * 
 * Capacidades:
 * - Publicaciones bilingües simultáneas/paralelas (Español e Inglés) por cada tiempo homologado o modificado
 * - Notificaciones de aprobación en la oficina técnica de homologación
 * - Notificaciones de modificación desde la sección Leaderboards (vía checkbox de webhook)
 * - Rechazos de solicitudes con motivo reglamentario
 * - Eliminaciones de registros
 * - Publicación de clasificaciones de temporada Blacklist
 */

const NFS_DISCORD_NOTIFIER = (function () {
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1552495472365543554/2VZ91_lHgDLdAHruuAfFDOf33g_F1jtfzbE3BKejAykYwiI3aLmBh64gzevwccaxtzgd";
    const BOT_NAME = "NFS Most Wanted Ranks • Comisaría";
    const AVATAR_URL = "https://i.imgur.com/8Q9b7w0.png";

    // Paleta de colores oficial Discord Embed (en entero decimal)
    const COLORS = {
        APPROVED_GOLD: 0xf59e0b,  // #f59e0b (Oro / Récord)
        APPROVED_GREEN: 0x22c55e, // #22c55e (Verde neón homologado)
        UPDATED_BLUE: 0x3b82f6,   // #3b82f6 (Azul modificación técnica)
        REJECTED_RED: 0xef4444,   // #ef4444 (Rojo alerta rechazo)
        DELETED_DARK: 0x64748b,   // #64748b (Gris eliminación)
        SEASON_CYAN: 0x06b6d4     // #06b6d4 (Cyan Temporada)
    };

    /**
     * Envío genérico al Webhook de Discord
     */
    async function sendWebhookPayload(payload) {
        if (!WEBHOOK_URL) return false;
        try {
            const body = {
                username: BOT_NAME,
                avatar_url: AVATAR_URL,
                ...payload
            };

            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                console.warn("Discord Webhook status:", res.status, res.statusText);
            }
            return res.ok;
        } catch (e) {
            console.warn("Error enviando notificación a Discord:", e);
            return false;
        }
    }

    // =======================================================
    // HELPERS DE TRADUCCIÓN Y FORMATEO BILINGÜE
    // =======================================================

    function translateDeviceToEN(device) {
        if (!device) return 'PC Keyboard';
        const d = String(device).trim();
        const map = {
            'Teclado': 'PC Keyboard',
            'Mando': 'Gamepad / Controller',
            'Mando Xbox': 'Xbox Controller',
            'Xbox One': 'Xbox One Controller',
            'Xbox Series X': 'Xbox Series X Controller',
            'Xbox': 'Xbox Controller',
            'DualSense': 'PlayStation 5 DualSense Controller',
            'PlayStation DualSense': 'PlayStation 5 DualSense Controller',
            'PlayStation 5 DualSense': 'PlayStation 5 DualSense Controller',
            'PlayStation 4 DualShock 4': 'PlayStation 4 DualShock 4 Controller',
            'PlayStation DualShock 4': 'PlayStation 4 DualShock 4 Controller',
            'DualShock 4': 'PlayStation 4 DualShock 4 Controller',
            'DS4': 'PlayStation 4 DualShock 4 Controller',
            'PlayStation 3 DualShock 3': 'PlayStation 3 DualShock 3 Controller',
            'PlayStation DualShock 3': 'PlayStation 3 DualShock 3 Controller',
            'DualShock 3': 'PlayStation 3 DualShock 3 Controller',
            'Logitech Dual Action': 'Logitech Dual Action Gamepad',
            'Dual Action': 'Logitech Dual Action Gamepad',
            'TA': 'Logitech Dual Action Gamepad',
            'Logitech F310': 'Logitech F310 Gamepad',
            'Logitech F710': 'Logitech F710 Wireless Gamepad',
            'Logitech Extreme 3D Pro': 'Logitech Extreme 3D Pro Flightstick',
            'Volante': 'Racing Wheel & Pedals',
            'Mando Genérico': 'Generic Gamepad / Pad',
            'Mando Genérico / Pad': 'Generic Gamepad / Pad'
        };
        return map[d] || d;
    }

    function translateGearboxToEN(gearbox) {
        if (!gearbox) return 'Manual';
        const g = String(gearbox).trim().toLowerCase();
        if (g.includes('auto')) return 'Automatic Transmission';
        return 'Manual Transmission';
    }

    function translateCategoryToEN(cat) {
        if (!cat) return 'Junkman (Performance Upgrades)';
        let c = String(cat);
        c = c.replace(/Vuelta Única|Vuelta Unica/gi, 'Single Lap');
        c = c.replace(/Vuelta Rápida|Vuelta Rapida/gi, 'Fastest Lap');
        c = c.replace(/Circuito/gi, 'Circuit');
        c = c.replace(/Junkman/gi, 'Junkman (Performance Upgrades)');
        c = c.replace(/BMW M3 GTR/gi, 'BMW M3 GTR (Stock / Canonical)');
        return c;
    }

    // =======================================================
    // CONSTRUCTORES DE PAYLOAD (ESPAÑOL & INGLÉS)
    // =======================================================

    function buildApprovalPayloadES(data) {
        const isWorldRecord = data.rank === '#1' || data.rank === 1;
        const isUpdate = Boolean(data.isUpdate || data.actionType === 'update');

        let color = COLORS.APPROVED_GREEN;
        if (isWorldRecord) {
            color = COLORS.APPROVED_GOLD;
        } else if (isUpdate) {
            color = COLORS.UPDATED_BLUE;
        }

        let rankBadge = isWorldRecord ? '👑 ¡NUEVO RÉCORD MUNDIAL #1!' : `🏁 Puesto Asignado: ${data.rank}`;
        if (isUpdate && isWorldRecord) {
            rankBadge = '👑 ¡RÉCORD MUNDIAL #1 ACTUALIZADO!';
        } else if (isUpdate) {
            rankBadge = `✏️ Registro Actualizado en Posición: ${data.rank}`;
        }

        const seasonText = data.seasonName ? `\n🏆 **Evento Oficial**: ${data.seasonName} · ${data.weekTitle || ''}` : '';

        const fields = [
            { name: "👤 Piloto", value: `**${data.driver || 'Desconocido'}**`, inline: true },
            { name: "🏁 Trazado / Pista", value: `${data.route || 'General'}`, inline: true },
            { name: "🏆 Categoría", value: `${data.category || 'Junkman'}`, inline: true },
            { name: "⏱️ Tiempo Oficial", value: `**\`${data.time}\`**`, inline: true },
            { name: "🏎️ Vehículo", value: `${data.car || 'BMW M3 GTR'}`, inline: true },
            { name: "🎮 Dispositivo & Caja", value: `${data.device || 'Teclado'} · ${data.gearbox || 'Manual'}`, inline: true },
            { name: "👮 Comisario Validador", value: `${data.moderator || 'Comisaría Oficial'}`, inline: true },
            { name: "📅 Fecha de Validación", value: `${data.date || new Date().toISOString().split('T')[0]}`, inline: true }
        ];

        if (data.rewardDesc) {
            fields.push({ name: "🎁 Recompensa Asignada", value: `${data.rewardDesc}`, inline: false });
        }

        if (data.videoUrl && data.videoUrl !== '#' && data.videoUrl !== '') {
            fields.push({ name: "🎬 Video de Telemetría", value: `[Ver Prueba en Video](${data.videoUrl})`, inline: true });
        }

        const routeParam = encodeURIComponent(data.route || '');
        const catParam = encodeURIComponent(data.categoryKey || (data.category && data.category.includes('BMW') ? 'bmw' : 'junkman'));
        const leaderboardUrl = `https://nfsmwranks.online/leaderboard?route=${routeParam}&cat=${catParam}`;
        fields.push({
            name: "📊 Tabla Leaderboard Oficial",
            value: `[Consultar Clasificación en Vivo](${leaderboardUrl})`,
            inline: true
        });

        const actionTitle = isUpdate 
            ? `✏️ [ES] MODIFICACIÓN OFICIAL DE TIEMPO: ${data.driver} [${data.time}]`
            : `✓ [ES] HOMOLOGACIÓN OFICIAL: ${data.driver} [${data.time}]`;

        const descText = isUpdate
            ? `${rankBadge}\nSe ha verificado y actualizado oficialmente el registro del piloto en la tabla Leaderboard.${seasonText}`
            : `${rankBadge}\nSe ha validado y publicado oficialmente el registro de tiempo en la tabla Leaderboard.${seasonText}`;

        const embed = {
            title: actionTitle,
            description: descText,
            color: color,
            fields: fields,
            footer: { text: "NFS Most Wanted Ranks • Sistema Oficial de Homologaciones 2026 [ES]" },
            timestamp: new Date().toISOString()
        };

        let alertContent = `📢 **[ES] NUEVO REGISTRO HOMOLOGADO** • **${data.driver}** [${data.time}] en **${data.route}**`;
        if (isWorldRecord) {
            alertContent = `🚨 @everyone ¡Nuevo Récord Mundial marcado por **${data.driver}** en **${data.route}**!`;
        } else if (isUpdate) {
            alertContent = `✏️ **[ES] TIEMPO MODIFICADO EN LEADERBOARDS** • **${data.driver}** [${data.time}] en **${data.route}**`;
        }

        return {
            content: alertContent,
            embeds: [embed]
        };
    }

    function buildApprovalPayloadEN(data) {
        const isWorldRecord = data.rank === '#1' || data.rank === 1;
        const isUpdate = Boolean(data.isUpdate || data.actionType === 'update');

        let color = COLORS.APPROVED_GREEN;
        if (isWorldRecord) {
            color = COLORS.APPROVED_GOLD;
        } else if (isUpdate) {
            color = COLORS.UPDATED_BLUE;
        }

        let rankBadge = isWorldRecord ? '👑 NEW WORLD RECORD #1!' : `🏁 Assigned Position: ${data.rank}`;
        if (isUpdate && isWorldRecord) {
            rankBadge = '👑 WORLD RECORD #1 UPDATED!';
        } else if (isUpdate) {
            rankBadge = `✏️ Record Updated at Position: ${data.rank}`;
        }

        const seasonTextEN = data.seasonName ? `\n🏆 **Official Event**: Blacklist Championship 2026 · ${data.weekTitle ? data.weekTitle.replace('Semana', 'Week') : ''}` : '';

        const fields = [
            { name: "👤 Driver / Pilot", value: `**${data.driver || 'Unknown'}**`, inline: true },
            { name: "🏁 Track / Route", value: `${data.route || 'General'}`, inline: true },
            { name: "🏆 Category", value: `${translateCategoryToEN(data.category)}`, inline: true },
            { name: "⏱️ Official Lap Time", value: `**\`${data.time}\`**`, inline: true },
            { name: "🏎️ Vehicle / Car", value: `${data.car || 'BMW M3 GTR'}`, inline: true },
            { name: "🎮 Device & Gearbox", value: `${translateDeviceToEN(data.device)} · ${translateGearboxToEN(data.gearbox)}`, inline: true },
            { name: "👮 Technical Steward", value: `${data.moderator || 'Official Stewards'}`, inline: true },
            { name: "📅 Verification Date", value: `${data.date || new Date().toISOString().split('T')[0]}`, inline: true }
        ];

        if (data.rewardDesc) {
            fields.push({ name: "🎁 Reward Granted", value: `${data.rewardDesc}`, inline: false });
        }

        if (data.videoUrl && data.videoUrl !== '#' && data.videoUrl !== '') {
            fields.push({ name: "🎬 Telemetry Proof", value: `[Watch Video Evidence](${data.videoUrl})`, inline: true });
        }

        const routeParam = encodeURIComponent(data.route || '');
        const catParam = encodeURIComponent(data.categoryKey || (data.category && data.category.includes('BMW') ? 'bmw' : 'junkman'));
        const leaderboardUrl = `https://nfsmwranks.online/leaderboard?route=${routeParam}&cat=${catParam}`;
        fields.push({
            name: "📊 Official Leaderboards",
            value: `[Check Live Rankings on NFSMWRanks](${leaderboardUrl})`,
            inline: true
        });

        const actionTitle = isUpdate 
            ? `✏️ [EN] OFFICIAL TIME UPDATE: ${data.driver} [${data.time}]`
            : `✓ [EN] OFFICIAL HOMOLOGATION: ${data.driver} [${data.time}]`;

        const descText = isUpdate
            ? `${rankBadge}\nThe driver's record on **${data.route}** has been updated and officially verified in the Leaderboard.${seasonTextEN}`
            : `${rankBadge}\nThe lap time record has been officially verified and published to the Leaderboard.${seasonTextEN}`;

        const embed = {
            title: actionTitle,
            description: descText,
            color: color,
            fields: fields,
            footer: { text: "NFS Most Wanted Ranks • Official Homologation System 2026 [EN]" },
            timestamp: new Date().toISOString()
        };

        let alertContent = `📢 **[EN] NEW HOMOLOGATED LAP TIME** • **${data.driver}** [${data.time}] on **${data.route}**`;
        if (isWorldRecord) {
            alertContent = `🚨 @everyone New World Record set by **${data.driver}** on **${data.route}**!`;
        } else if (isUpdate) {
            alertContent = `✏️ **[EN] TIME MODIFIED IN LEADERBOARDS** • **${data.driver}** [${data.time}] on **${data.route}**`;
        }

        return {
            content: alertContent,
            embeds: [embed]
        };
    }

    /**
     * Notificar Aprobación / Homologación o Modificación de Tiempo
     * Publica paralelamente una versión en Español y otra en Inglés
     */
    async function notifyApproval(data) {
        const payloadES = buildApprovalPayloadES(data);
        const payloadEN = buildApprovalPayloadEN(data);

        // Envío en paralelo mediante Promise.all
        // Se aplica un breve desfase de 200ms en el segundo mensaje para garantizar
        // que Discord preserve estrictamente el orden en el canal (Español primero, luego Inglés)
        const sendES = sendWebhookPayload(payloadES);
        const sendEN = (async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            return sendWebhookPayload(payloadEN);
        })();

        const [resES, resEN] = await Promise.all([sendES, sendEN]);
        return resES && resEN;
    }

    /**
     * Alias explícito para notificar modificaciones desde Leaderboards
     */
    async function notifyLeaderboardUpdate(data) {
        return notifyApproval({ ...data, isUpdate: true, actionType: 'update' });
    }

    /**
     * Notificar Rechazo de una Solicitud
     */
    async function notifyRejection(data) {
        const fields = [
            { name: "👤 Piloto / Driver", value: `**${data.driver || 'Desconocido'}**`, inline: true },
            { name: "🏁 Pista / Track", value: `${data.route || 'General'}`, inline: true },
            { name: "⏱️ Tiempo Declarado / Time", value: `\`${data.time || '--'}\``, inline: true },
            { name: "🚗 Auto / Vehicle", value: `${data.car || '--'}`, inline: true },
            { name: "👮 Revisado por / Steward", value: `${data.moderator || 'Admin Oficial'}`, inline: true },
            { name: "📅 Fecha / Date", value: `${new Date().toLocaleDateString('es-ES')}`, inline: true }
        ];

        if (data.reason) {
            fields.push({ name: "⚠️ Motivo del Rechazo / Reason", value: `${data.reason}`, inline: false });
        }

        if (data.videoUrl && data.videoUrl !== '#' && data.videoUrl !== '') {
            fields.push({ name: "🎬 Video Inspeccionado / Video Proof", value: `[Enlace](${data.videoUrl})`, inline: false });
        }

        const embed = {
            title: `✗ SOLICITUD RECHAZADA // SUBMISSION REJECTED: ${data.driver}`,
            description: `La solicitud de tiempo para **${data.route}** no cumplió los requisitos de validación reglamentarios.\nThe submission for **${data.route}** did not meet official verification requirements.`,
            color: COLORS.REJECTED_RED,
            fields: fields,
            footer: { text: "Comisaría Técnica NFS MW Ranks • Technical Stewards" },
            timestamp: new Date().toISOString()
        };

        return await sendWebhookPayload({ embeds: [embed] });
    }

    /**
     * Notificar Eliminación de un Registro
     */
    async function notifyDeletion(data) {
        const fields = [
            { name: "👤 Piloto / Driver", value: `**${data.driver || 'Desconocido'}**`, inline: true },
            { name: "🏁 Pista / Track", value: `${data.route || 'General'}`, inline: true },
            { name: "⏱️ Tiempo Retirado / Time", value: `\`${data.time || '--'}\``, inline: true },
            { name: "👮 Moderador / Steward", value: `${data.moderator || 'Admin Oficial'}`, inline: true }
        ];

        const embed = {
            title: `🗑️ REGISTRO ELIMINADO // RECORD REMOVED: ${data.driver} (${data.route})`,
            description: `Se ha retirado formalmente un registro del sistema o de la cola de envíos.\nA record has been formally removed from the official leaderboards.`,
            color: COLORS.DELETED_DARK,
            fields: fields,
            footer: { text: "Auditoría de Registros NFS MW Ranks • Record Audit" },
            timestamp: new Date().toISOString()
        };

        return await sendWebhookPayload({ embeds: [embed] });
    }

    /**
     * Notificar Publicación de Clasificación Oficial de Temporada
     */
    async function notifySeasonStandings(data) {
        const top3Text = (data.top3 && data.top3.length)
            ? data.top3.map((p, i) => `${['🥇', '🥈', '🥉'][i] || '🎖️'} **${p.driver}** — ${p.totalPts} PTS (${p.totalBounty || ''})`).join('\n')
            : "No hay podio disponible / No podium available";

        const fields = [
            { name: "🏆 Temporada / Season", value: `**${data.seasonName}**`, inline: true },
            { name: "📅 Período / Period", value: `${data.period || ''}`, inline: true },
            { name: "👥 Pilotos Clasificados / Ranked Drivers", value: `${data.totalPilots || 0}`, inline: true },
            { name: "👑 Podio de Honor / Podium", value: top3Text, inline: false },
            { name: "👮 Comisario Responsable / Steward", value: `${data.moderator || 'Admin Oficial'}`, inline: true }
        ];

        const embed = {
            title: `🏆 CLASIFICACIÓN OFICIAL PUBLICADA // OFFICIAL STANDINGS: ${data.seasonName}`,
            description: `Se ha actualizado y publicado en tiempo real la tabla general de posiciones de la temporada.\nThe official season standings have been computed and published live.`,
            color: COLORS.SEASON_CYAN,
            fields: fields,
            footer: { text: "Blacklist Championship 2026 • NFS Most Wanted Ranks" },
            timestamp: new Date().toISOString()
        };

        return await sendWebhookPayload({
            content: `📢 @everyone ¡Se ha publicado la Clasificación Oficial de la **${data.seasonName}**! / Official Standings for **${data.seasonName}** published!`,
            embeds: [embed]
        });
    }

    return {
        notifyApproval,
        notifyLeaderboardUpdate,
        notifyRejection,
        notifyDeletion,
        notifySeasonStandings,
        sendRaw: sendWebhookPayload
    };
})();

if (typeof window !== 'undefined') {
    window.NFS_DISCORD_NOTIFIER = NFS_DISCORD_NOTIFIER;
}
