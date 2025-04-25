import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: any[] = [];

  newTransaction = {
    type: '',
    amount: 0,
    description: '',
    date: '',
    account: '',
    category: ''
  };

  exportDate: string = '';
  totalCredit: number = 0;
  totalDebit: number = 0;

  // Filter properties
  selectedFilter: 'all' | 'monthly' | 'weekly' = 'all';
  selectedCategory: string = '';
  selectedAccount: string = '';
  startDate: string = '';
  endDate: string = '';

  // Pie Chart
  pieChartLabels: string[] = ['Total Credit', 'Total Debit'];
  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0], label: 'Credit vs Debit' }]
  };
  pieChartType: ChartType = 'pie';

  // Bar Chart
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [{ data: [], label: 'Category-wise Spend' }]
  };
  barChartType: ChartType = 'bar';

  constructor(private txService: TransactionService, private authService: AuthService) {}

  ngOnInit() {
    this.txService.getTransactions().subscribe(data => {
      this.transactions = data;
      this.calculateTotals();
    });
  }

  addTransaction() {
    this.txService.addTransaction(this.newTransaction).subscribe(added => {
      this.transactions.push(added);
      this.calculateTotals();
      this.newTransaction = {
        type: '',
        amount: 0,
        description: '',
        date: '',
        account: '',
        category: ''
      };
    });
  }

  logout() {
    this.authService.logout();
  }

  exportToPDF() {
    if (!this.exportDate) {
      alert('Please select a date to export transactions from.');
      return;
    }

    const filteredTransactions = this.transactions.filter(tx =>
      new Date(tx.date) >= new Date(this.exportDate)
    );

    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 15);

    autoTable(doc, {
      head: [['Type', 'Amount', 'Description', 'Date', 'Account', 'Category']],
      body: filteredTransactions.map(tx => [
        tx.type,
        `₹${tx.amount}`,
        tx.description,
        new Date(tx.date).toLocaleDateString(),
        tx.account,
        tx.category
      ]),
      startY: 25
    });

    doc.save(`transactions-from-${this.exportDate}.pdf`);
  }

  getFilteredTransactions() {
    return this.transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      const matchCategory = this.selectedCategory ? tx.category === this.selectedCategory : true;
      const matchAccount = this.selectedAccount ? tx.account === this.selectedAccount : true;
      const matchDate = (!start || txDate >= start) && (!end || txDate <= end);

      if (this.selectedFilter === 'monthly') {
        const now = new Date();
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear() &&
          matchCategory &&
          matchAccount &&
          matchDate
        );
      } else if (this.selectedFilter === 'weekly') {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo && txDate <= now && matchCategory && matchAccount && matchDate;
      } else {
        return matchCategory && matchAccount && matchDate;
      }
    });
  }

  calculateTotals() {
    this.totalCredit = 0;
    this.totalDebit = 0;
    const categoryMap: { [key: string]: number } = {};
    const filtered = this.getFilteredTransactions();

    filtered.forEach(tx => {
      const amount = Number(tx.amount);
      if (tx.type === 'credit') this.totalCredit += amount;
      if (tx.type === 'debit') this.totalDebit += amount;

      const category = tx.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    this.pieChartData = {
      labels: ['Total Credit', 'Total Debit'],
      datasets: [{ data: [this.totalCredit, this.totalDebit], label: 'Credit vs Debit' }]
    };

    this.barChartLabels = Object.keys(categoryMap);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [{ data: Object.values(categoryMap), label: 'Category-wise Spend' }]
    };
  }

  reportEmail: string = '';
  reportFrequency: 'daily' | 'weekly' = 'daily';

  sendSummaryReport() {
    const summaryRequest = {
      email: this.reportEmail,
      frequency: this.reportFrequency,
      transactions: this.transactions
    };

    this.txService.sendReport(summaryRequest).subscribe({
      next: () => alert('Report sent successfully!'),
      error: err => console.error('Failed to send report:', err)
    });
  }
}
