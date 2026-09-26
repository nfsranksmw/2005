/**
 * DISCORD NOTIFIER - Need for Speed: Most Wanted (2005)
 * Conector oficial con el Webhook de Discord del Servidor de NFS MW Ranks
 * Notifica en tiempo real:
 * - Aprobaciones y homologaciones oficiales de tiempos
 * - Rechazos de solicitudes con motivo
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
        REJECTED_RED: 0xef4444,   // #ef4444 (Rojo alerta rechazo)
        DELETED_DARK: 0x64748b,   // #64748b (Gris eliminación)
        SEASON_CYAN: 0x06b6d4     // #06b6d4 (Cyan Temporada)
    };

    /**
     * Envío genérico al Webhook de Discord
     */
    async function sendWebhookPayload(payload) {
        if (!WEBHOOK_URL) return;
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

    /**
     * Notificar Aprobación / Homologación de Tiempo
     */
    async function notifyApproval(data) {
        const isWorldRecord = data.rank === '#1' || data.rank === 1;
        const color = isWorldRecord ? COLORS.APPROVED_GOLD : COLORS.APPROVED_GREEN;
        const rankBadge = isWorldRecord ? '👑 ¡NUEVO RÉCORD MUNDIAL #1!' : `🏁 Puesto Asignado: ${data.rank}`;

        const seasonText = data.seasonName ? `\n🏆 **Evento**: ${data.seasonName} · ${data.weekTitle || ''}` : '';

        const fields = [
            { name: "👤 Piloto", value: `**${data.driver || 'Desconocido'}**`, inline: true },
            { name: "🏁 Trazado / Pista", value: `${data.route || 'General'}`, inline: true },
            { name: "🏆 Categoría", value: `${data.category || 'Junkman'}`, inline: true },
            { name: "⏱️ Tiempo Oficial", value: `**\`${data.time}\`**`, inline: true },
            { name: "🏎️ Vehículo", value: `${data.car || 'BMW M3 GTR'}`, inline: true },
            { name: "🎮 Periférico & Caja", value: `${data.device || 'PC'} · ${data.gearbox || 'Manual'}`, inline: true },
            { name: "👮 Comisario Validador", value: `${data.moderator || 'Admin Oficial'}`, inline: true },
            { name: "📅 Fecha", value: `${data.date || new Date().toISOString().split('T')[0]}`, inline: true }
        ];

        if (data.rewardDesc) {
            fields.push({ name: "🎁 Recompensa Asignada", value: `${data.rewardDesc}`, inline: false });
        }

        if (data.videoUrl && data.videoUrl !== '#' && data.videoUrl !== '') {
            fields.push({ name: "🎬 Video de Telemetría", value: `[Ver Prueba en Video](${data.videoUrl})`, inline: true });
        }

        // Enlace directo a la lista Leaderboard de la ruta en la web
        const routeParam = encodeURIComponent(data.route || '');
        const catParam = encodeURIComponent(data.categoryKey || (data.category && data.category.includes('BMW') ? 'bmw' : 'junkman'));
        const leaderboardUrl = `https://nfsmwranks.online/leaderboard?route=${routeParam}&cat=${catParam}`;
        fields.push({
            name: "📊 Tabla Leaderboard Oficial",
            value: `[Consultar Tabla en NFSMWRanks](${leaderboardUrl})`,
            inline: true
        });

        const embed = {
            title: `✓ HOMOLOGACIÓN OFICIAL: ${data.driver} [${data.time}]`,
            description: `${rankBadge}\nSe ha validado y publicado oficialmente el registro en el Leaderboard.${seasonText}`,
            color: color,
            fields: fields,
            footer: { text: "NFS Most Wanted Ranks • Sistema Oficial de Homologaciones 2026" },
            timestamp: new Date().toISOString()
        };

        return await sendWebhookPayload({
            content: isWorldRecord ? `🚨 @everyone ¡Nuevo Récord Mundial marcado por **${data.driver}** en **${data.route}**!` : undefined,
            embeds: [embed]
        });
    }

    /**
     * Notificar Rechazo de una Solicitud
     */
    async function notifyRejection(data) {
        const fields = [
            { name: "👤 Piloto", value: `**${data.driver || 'Desconocido'}**`, inline: true },
            { name: "🏁 Pista", value: `${data.route || 'General'}`, inline: true },
            { name: "⏱️ Tiempo Declarado", value: `\`${data.time || '--'}\``, inline: true },
            { name: "🚗 Auto", value: `${data.car || '--'}`, inline: true },
            { name: "👮 Revisado por", value: `${data.moderator || 'Admin Oficial'}`, inline: true },
            { name: "📅 Fecha", value: `${new Date().toLocaleDateString('es-ES')}`, inline: true }
        ];

        if (data.reason) {
            fields.push({ name: "⚠️ Motivo del Rechazo", value: `${data.reason}`, inline: false });
        }

        if (data.videoUrl && data.videoUrl !== '#' && data.videoUrl !== '') {
            fields.push({ name: "🎬 Video Inspeccionado", value: `[Enlace](${data.videoUrl})`, inline: false });
        }

        const embed = {
            title: `✗ SOLICITUD RECHAZADA: ${data.driver}`,
            description: `La solicitud de tiempo para **${data.route}** no cumplió los requisitos de validación reglamentarios.`,
            color: COLORS.REJECTED_RED,
            fields: fields,
            footer: { text: "Comisaría Técnica NFS MW Ranks" },
            timestamp: new Date().toISOString()
        };

        return await sendWebhookPayload({ embeds: [embed] });
    }

    /**
     * Notificar Eliminación de un Registro
     */
    async function notifyDeletion(data) {
        const fields = [
            { name: "👤 Piloto Afectado", value: `**${data.driver || 'Desconocido'}**`, inline: true },
            { name: "🏁 Pista / Tabla", value: `${data.route || 'General'}`, inline: true },
            { name: "⏱️ Tiempo Retirado", value: `\`${data.time || '--'}\``, inline: true },
            { name: "👮 Moderador", value: `${data.moderator || 'Admin Oficial'}`, inline: true }
        ];

        const embed = {
            title: `🗑️ REGISTRO ELIMINADO: ${data.driver} (${data.route})`,
            description: `Se ha retirado formalmente un registro del sistema o de la cola de envíos.`,
            color: COLORS.DELETED_DARK,
            fields: fields,
            footer: { text: "Auditoría de Registros NFS MW Ranks" },
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
            : "No hay podio disponible";

        const fields = [
            { name: "🏆 Temporada", value: `**${data.seasonName}**`, inline: true },
            { name: "📅 Período", value: `${data.period || ''}`, inline: true },
            { name: "👥 Pilotos Clasificados", value: `${data.totalPilots || 0}`, inline: true },
            { name: "👑 Podio de Honor", value: top3Text, inline: false },
            { name: "👮 Comisario Responsable", value: `${data.moderator || 'Admin Oficial'}`, inline: true }
        ];

        const embed = {
            title: `🏆 CLASIFICACIÓN OFICIAL PUBLICADA: ${data.seasonName}`,
            description: `Se ha actualizado y publicado en tiempo real la tabla general de posiciones de la temporada.`,
            color: COLORS.SEASON_CYAN,
            fields: fields,
            footer: { text: "Blacklist Championship 2026 • NFS Most Wanted Ranks" },
            timestamp: new Date().toISOString()
        };

        return await sendWebhookPayload({
            content: `📢 @everyone ¡Se ha publicado la Clasificación Oficial de la **${data.seasonName}**!`,
            embeds: [embed]
        });
    }

    return {
        notifyApproval,
        notifyRejection,
        notifyDeletion,
        notifySeasonStandings,
        sendRaw: sendWebhookPayload
    };
})();

if (typeof window !== 'undefined') {
    window.NFS_DISCORD_NOTIFIER = NFS_DISCORD_NOTIFIER;
}
