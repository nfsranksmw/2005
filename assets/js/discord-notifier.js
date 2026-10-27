/**
 * DISCORD NOTIFIER - Need for Speed: Most Wanted (2005)
 * Conector oficial con el Webhook "Verify Records" (#verified-runs ✅) del Servidor de NFS MW Ranks
 * 
 * Capacidades:
 * - Publicación bilingüe unificada (Inglés y Español en UN SOLO PIN / MENSAJE) por cada récord aprobado o modificado
 * - Notificaciones automáticas de aprobación desde la Cola de Moderación en admin.html
 * - Notificaciones desde el Gestor de Leaderboards (al agregar/editar o mediante botón directo de envío)
 * - Rechazos de solicitudes con motivo reglamentario (bilingüe)
 * - Eliminaciones de registros y publicación de clasificaciones de temporada Blacklist
 */

const NFS_DISCORD_NOTIFIER = (function () {
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1564734251814092900/ViKOSGJ6yuyKJKYBCPDmVSHm6N3oh48nLH9Yw8SCGJIapT61Gzv-0Vc3S7N9rF-_514j";

    // Paleta de colores oficial Discord Embed (en entero decimal)
    const COLORS = {
        APPROVED_GOLD: 0xf59e0b,  // #f59e0b (Oro / Récord Mundial #1)
        APPROVED_GREEN: 0x22c55e, // #22c55e (Verde neón homologado)
        UPDATED_BLUE: 0x3b82f6,   // #3b82f6 (Azul modificación técnica)
        REJECTED_RED: 0xef4444,   // #ef4444 (Rojo alerta rechazo)
        DELETED_DARK: 0x64748b,   // #64748b (Gris eliminación)
        SEASON_CYAN: 0x06b6d4     // #06b6d4 (Cyan Temporada)
    };

    /**
     * Envío genérico al Webhook de Discord (#verified-runs ✅ • Verify Records)
     * Respeta el nombre ("Verify Records") y el avatar oficial (icono NFS rojo) configurados en Discord.
     */
    async function sendWebhookPayload(payload) {
        if (!WEBHOOK_URL) return false;
        try {
            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
    // HELPERS DE TRADUCCIÓN Y FORMATEO BILINGÜE (EN / ES)
    // =======================================================

    function formatBilingualDevice(device) {
        if (!device) return 'PC Keyboard / Teclado';
        const d = String(device).trim();
        const map = {
            'Teclado': 'PC Keyboard / Teclado',
            'Mando': 'Gamepad / Mando',
            'Mando Xbox': 'Xbox Controller / Mando Xbox',
            'Xbox One': 'Xbox One Controller',
            'Xbox Series X': 'Xbox Series X Controller',
            'Xbox': 'Xbox Controller',
            'DualSense': 'PS5 DualSense Controller',
            'PlayStation DualSense': 'PS5 DualSense Controller',
            'PlayStation 5 DualSense': 'PS5 DualSense Controller',
            'PlayStation 4 DualShock 4': 'PS4 DualShock 4 Controller',
            'PlayStation DualShock 4': 'PS4 DualShock 4 Controller',
            'DualShock 4': 'PS4 DualShock 4 Controller',
            'DS4': 'PS4 DualShock 4 Controller',
            'PlayStation 3 DualShock 3': 'PS3 DualShock 3 Controller',
            'PlayStation DualShock 3': 'PS3 DualShock 3 Controller',
            'DualShock 3': 'PS3 DualShock 3 Controller',
            'Logitech Dual Action': 'Logitech Dual Action Gamepad',
            'Dual Action': 'Logitech Dual Action Gamepad',
            'TA': 'Logitech Dual Action Gamepad',
            'Logitech F310': 'Logitech F310 Gamepad',
            'Logitech F710': 'Logitech F710 Wireless Gamepad',
            'Logitech Extreme 3D Pro': 'Logitech Extreme 3D Pro',
            'Volante': 'Racing Wheel / Volante',
            'Mando Genérico': 'Generic Gamepad / Mando Genérico',
            'Mando Genérico / Pad': 'Generic Gamepad / Mando Genérico'
        };
        return map[d] || d;
    }

    function formatBilingualGearbox(gearbox) {
        if (!gearbox) return 'Manual';
        const g = String(gearbox).trim().toLowerCase();
        if (g.includes('auto')) return 'Automatic / Automática';
        return 'Manual';
    }

    function formatBilingualCategory(cat) {
        if (!cat) return 'Junkman';
        let c = String(cat).trim();
        c = c.replace(/Vuelta Única|Vuelta Unica/gi, 'Single Lap / Vuelta Única');
        c = c.replace(/Vuelta Rápida|Vuelta Rapida/gi, 'Fast Lap / Vuelta Rápida');
        return c;
    }

    // =======================================================
    // CONSTRUCTOR DE PAYLOAD BILINGÜE UNIFICADO (1 SOLO PIN)
    // =======================================================

    function buildUnifiedBilingualApprovalPayload(data) {
        const isWorldRecord = data.rank === '#1' || data.rank === 1;
        const isUpdate = Boolean(data.isUpdate || data.actionType === 'update');
        const rankStr = String(data.rank || '#1').startsWith('#') ? String(data.rank) : `#${data.rank}`;

        let color = COLORS.APPROVED_GREEN;
        if (isWorldRecord) {
            color = COLORS.APPROVED_GOLD;
        } else if (isUpdate) {
            color = COLORS.UPDATED_BLUE;
        }

        // Encabezados de estado en Inglés y Español
        let badgeEN = isWorldRecord ? '👑 **NEW WORLD RECORD #1!**' : `🏁 **Assigned Position:** \`${rankStr}\``;
        let badgeES = isWorldRecord ? '👑 **¡NUEVO RÉCORD MUNDIAL #1!**' : `🏁 **Puesto Asignado:** \`${rankStr}\``;

        if (isUpdate && isWorldRecord) {
            badgeEN = '👑 **WORLD RECORD #1 UPDATED!**';
            badgeES = '👑 **¡RÉCORD MUNDIAL #1 ACTUALIZADO!**';
        } else if (isUpdate) {
            badgeEN = `✏️ **Record Updated at Position:** \`${rankStr}\``;
            badgeES = `✏️ **Registro Actualizado en Posición:** \`${rankStr}\``;
        }

        const eventLineEN = data.seasonName
            ? `\n🏆 **Event:** Blacklist Championship 2026${data.weekTitle ? ' · ' + data.weekTitle.replace(/Semana/gi, 'Week') : ''}`
            : '';
        const eventLineES = data.seasonName
            ? `\n🏆 **Evento:** ${data.seasonName}${data.weekTitle ? ' · ' + data.weekTitle : ''}`
            : '';

        const descEN = isUpdate
            ? `🇬🇧 **ENGLISH** — ${badgeEN}\nThe lap time record by **${data.driver || 'Unknown'}** on **${data.route || 'Track'}** has been officially verified and updated in the live Leaderboard.${eventLineEN}`
            : `🇬🇧 **ENGLISH** — ${badgeEN}\nA new official lap time by **${data.driver || 'Unknown'}** on **${data.route || 'Track'}** has been verified and homologated by the Technical Stewards.${eventLineEN}`;

        const descES = isUpdate
            ? `🇪🇸 **ESPAÑOL** — ${badgeES}\nEl registro de tiempo de **${data.driver || 'Desconocido'}** en **${data.route || 'Pista'}** ha sido verificado y actualizado oficialmente en la tabla Leaderboard.${eventLineES}`
            : `🇪🇸 **ESPAÑOL** — ${badgeES}\nUn nuevo tiempo oficial de **${data.driver || 'Desconocido'}** en **${data.route || 'Pista'}** ha sido validado y homologado por la Comisaría Técnica.${eventLineES}`;

        const fields = [
            { name: "👤 Driver / Piloto", value: `**${data.driver || 'Unknown'}**`, inline: true },
            { name: "🏁 Track / Pista", value: `**${data.route || 'General'}**`, inline: true },
            { name: "🥇 Position / Puesto", value: `**\`${rankStr}\`**`, inline: true },
            { name: "⏱️ Official Time / Tiempo", value: `**\`${data.time || '--:--.---'}\`**`, inline: true },
            { name: "🏆 Category / Categoría", value: `${formatBilingualCategory(data.category)}`, inline: true },
            { name: "🏎️ Car / Vehículo", value: `${data.car || 'BMW M3 GTR'}`, inline: true },
            { name: "🎮 Setup / Dispositivo & Caja", value: `${formatBilingualDevice(data.device)} · ${formatBilingualGearbox(data.gearbox)}`, inline: true },
            { name: "👮 Verified By / Comisario", value: `${data.moderator || 'Official Stewards / Comisaría'}`, inline: true },
            { name: "📅 Date / Fecha", value: `${data.date || new Date().toISOString().split('T')[0]}`, inline: true }
        ];

        if (data.rewardDesc) {
            fields.push({
                name: "🎁 Reward Granted / Recompensa Asignada",
                value: `${data.rewardDesc}`,
                inline: false
            });
        }

        if (data.videoUrl && data.videoUrl !== '#' && data.videoUrl !== '') {
            fields.push({
                name: "🎬 Telemetry Proof / Prueba en Video",
                value: `[▶️ Watch Video Proof / Ver Video de Telemetría](${data.videoUrl})`,
                inline: true
            });
        }

        const routeParam = encodeURIComponent(data.route || '');
        const catParam = encodeURIComponent(data.categoryKey || (data.category && String(data.category).toLowerCase().includes('bmw') ? 'bmw' : 'junkman'));
        const leaderboardUrl = `https://nfsmwranks.online/leaderboard?route=${routeParam}&cat=${catParam}`;
        fields.push({
            name: "📊 Live Leaderboard / Tabla Oficial",
            value: `[🌐 View Live Standings / Consultar Clasificación](${leaderboardUrl})`,
            inline: true
        });

        const embedTitle = isUpdate
            ? `✏️ VERIFIED RECORD UPDATED // RÉCORD ACTUALIZADO: ${data.driver} [${data.time}]`
            : `✅ VERIFIED RECORD APPROVED // RÉCORD HOMOLOGADO: ${data.driver} [${data.time}]`;

        const embed = {
            title: embedTitle,
            description: `${descEN}\n\n${descES}`,
            color: color,
            fields: fields,
            footer: {
                text: "NFS Most Wanted Ranks • Official Time Verification System [EN / ES]"
            },
            timestamp: new Date().toISOString()
        };

        // Un único mensaje/pin con resumen bilingüe en content
        let alertContent = `✅ **VERIFIED RUN / TIEMPO HOMOLOGADO** • **${data.driver}** logged **\`${data.time}\`** (${rankStr}) on **${data.route}**!`;
        if (isWorldRecord) {
            alertContent = `🚨 @everyone **NEW WORLD RECORD / ¡NUEVO RÉCORD MUNDIAL #1!** • **${data.driver}** clocked **\`${data.time}\`** on **${data.route}**! 🏆`;
        } else if (isUpdate) {
            alertContent = `✏️ **VERIFIED TIME UPDATED / TIEMPO ACTUALIZADO** • **${data.driver}** — **\`${data.time}\`** (${rankStr}) on **${data.route}**`;
        }

        return {
            content: alertContent,
            embeds: [embed]
        };
    }

    /**
     * Notificar Aprobación / Homologación o Modificación de Tiempo
     * Envía UN SOLO PIN / MENSAJE BILINGÜE (Inglés + Español) al canal #verified-runs ✅
     */
    async function notifyApproval(data) {
        const unifiedPayload = buildUnifiedBilingualApprovalPayload(data);
        return await sendWebhookPayload(unifiedPayload);
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
