export interface ProTipRule {
    triggers: string[]; // Brand or model keywords (fuzzy match)
    advice: string;
}

const RULES: ProTipRule[] = [
    {
        triggers: ['Venice 2', 'Rialto 2'],
        advice: "💡 Rialto kurulumunda kablo yönetimi için 90 derece BNC adaptörleri ve güvenlik halatını unutmayın."
    },
    {
        triggers: ['Alexa 35'],
        advice: "💡 Alexa 35 yüksek güç çeker. Sadece yüksek amperli B-Mount bataryalar (min. 155Wh) kullanın."
    },
    {
        triggers: ['dji', 'transmission'],
        advice: "💡 DJI Transmission yüksek menzil sunar ancak gecikmesi (60-100ms) yüksektir. Hassas odak takibi (focus pulling) için Teradek tercih edilmesi önerilir."
    },
    {
        triggers: ['Bolt 4K'],
        advice: "💡 Tavsiye: Bolt 4K kullanımı sırasında uzun mesafe veya yüksek parazit (interference) olan setlerde 'High-gain Array Antenna' kullanılması sinyal stabilitesini artırır."
    },
    {
        triggers: ['Rialto 2'],
        advice: "💡 Rialto 2 Operasyonel İpucu: Hızlı ayar değişimi için head üzerindeki Button 1'i 'ND Filter Toggle', Button 2'yi ise 'ISO/Base Sensitivity' olarak atamanız önerilir."
    },
    {
        triggers: ['Bolt 4K', 'Array Antenna'],
        advice: "🚨 Frekans Güvenliği: Bolt 4K ve Array Panel birlikte kullanıldığında sinyal çakışması riski artar. Manuel DFS kanal seçimi yapılması önerilir."
    }
];

/**
 * Returns professional advice based on the current kit items.
 */
export function getProTips(inventory: any[]): string[] {
    const tips: string[] = [];
    const kitText = inventory.map(item =>
        `${item.brand} ${item.model} ${item.name}`.toLowerCase()
    ).join(' ');

    RULES.forEach(rule => {
        // Check if all triggers in the rule are present in the kit
        const allPresent = rule.triggers.every(trigger =>
            kitText.includes(trigger.toLowerCase())
        );

        if (allPresent) {
            tips.push(rule.advice);
        }
    });

    return Array.from(new Set(tips)); // Deduplicate
}
