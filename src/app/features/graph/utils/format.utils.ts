export class FormatUtil {
    static formatCurrency(value: number): string {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    }

    static formatDate(date: string | Date): string {
        return new Date(date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static formatDateForChart(date: string | Date): string {
        return new Date(date).toLocaleDateString('it-IT', {
            month: 'short',
            day: 'numeric'
        });
    }

    static formatNumber(value: number): string {
        return Number(value).toLocaleString('it-IT');
    }
}