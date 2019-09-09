import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { SurveyService } from '../services/survey.service';

/* tslint:disable */
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	constructor(private surveyService: SurveyService) { }

	surveyId: string;
	title: any = [];
	// tslint:disable-next-line:ban-types
	newArray: any = [];
	survey = [];
	question: any = [];
	myChart: any = 0;
	ctx: any = 0;
	barChartColor = [
		'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
		'rgba(3, 244, 252,0.2)', 'rgba(99, 148, 238,0.2)',
		'rgba(3, 244, 252,0.2)', 'rgba(177, 252, 3,0.2)'
	]
	ngOnInit() {
		this.getUnderSurvey();
	}

	getUnderSurvey = () => {
		this.surveyId = localStorage.getItem('sid');
		// tslint:disable-next-line:ban-types
		const userName = localStorage.getItem('name');

		this.surveyService.getUnderSurvey(userName)
			.subscribe((result) => {
				this.survey = result;
				this.title = this.survey[0].title;

				const multiArray = this.survey[0].assignees.map(x => x.response.map(y => y.response));
				this.gotArray(multiArray);
				this.showChart()

			});
	}

	onchange = (e) => {
		this.newArray = [];
		const selectedSurvey = this.survey.find(item => item['_id'] === e);
		this.title = selectedSurvey.title;
		const multiArray = selectedSurvey.assignees.map(x => x.response.map(y => y.response));
		this.gotArray(multiArray);
		this.showChart()
	}
	r = (e, f) => {
		return e + f;
	}
	showChart = () => {
		if (this.myChart) {
			this.myChart.data.datasets[0].data = this.newArray;
			this.myChart.data.labels = this.question;
			this.myChart.update();
		} else {
			this.ctx = document.getElementById('myChart');
			this.myChart = new Chart(this.ctx, {
				type: 'bar',
				data: {
					labels: this.question,
					datasets: [{
						label: '# of Votes',
						data: this.newArray,
						backgroundColor: this.barChartColor,
						borderColor: this.barChartColor,
						borderWidth: 1
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								min: 0,
								max: 10,
								beginAtZero: true
							}
						}]
					}
				}
			});
		}
	}
	gotArray = (multiArray) => {
		this.question = [];
		let nullArray = [];
		let myArray = [];
		multiArray.forEach(e => {
			if (e.length === 0) {
				console.log('null');
			} else {
				nullArray.push(e);
			}
		});
		if (nullArray.length === 0) {
			console.log('Survey has no fill data yet')
		} else {

			for (var i = 0; i < nullArray[0].length; i++) {
				var num = 0;
				var length = nullArray.length;
				this.question.push('Question ' + (i + 1))
				// still assuming all arrays have the same amount of numbers
				// tslint:disable-next-line:prefer-for-of
				for (let i2 = 0; i2 < nullArray.length; i2++) {
					num += nullArray[i2][i];
				}
				console.log('num ', length)
				myArray.push(Math.round(num / length));
			}
			this.newArray = [];
			this.newArray.splice(0, this.newArray.length, ...myArray);
		}
	}
}
