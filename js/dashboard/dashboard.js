// Dashboard summary cards are updated from the authenticated task list returned by the backend.
const totalTasks = document.querySelector('#total-tasks');
const completedTasks = document.querySelector('#completed-tasks');
const pendingTasks = document.querySelector('#pending-tasks');
const progressTasks = document.querySelector('#progress-tasks');



// Normalize various backend status values into the three groups used by the UI cards and charts.
const statusGroup = (status) => {
	const value = String(status || '').toLowerCase().replace(/[_-]/g, ' ');
	if (value.includes('complete') || value === 'done') return 'Completed';
	if (value.includes('progress')) return 'In Progress';
	return 'Pending';
};

// Render the status and priority charts using the aggregated task counts from the current user data.
const renderCharts = (statuses, priorities) => {
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } }
	};

	new Chart(document.querySelector('#status-chart'), {
		type: 'doughnut',
		data: {
			labels: Object.keys(statuses),
			datasets: [{ data: Object.values(statuses), backgroundColor: ['#299e75', '#da8a39', '#5b5ce2'], borderWidth: 0 }]
		},
		options: { ...chartOptions, cutout: '68%' }
	});

	new Chart(document.querySelector('#priority-chart'), {
		type: 'bar',
		data: {
			labels: Object.keys(priorities),
			datasets: [{ label: 'Tasks', data: Object.values(priorities), backgroundColor: ['#d35568', '#da8a39', '#299e75'], borderRadius: 6, barThickness: 38 }]
		},
		options: {
			...chartOptions,
			plugins: { legend: { display: false } },
			scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }
		}
	});
};

// Fetch the authenticated user's tasks and derive the dashboard metrics and charts from them.
const loadDashboard = async () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		window.location.href = '../../pages/auth/login.html'
		return;
	};

	try {
		// Request the task list using the stored JWT so only the logged-in user's items are returned.
		const response = await fetch('https://intern-crud-task-api.onrender.com/api/tasks', {
			headers: { Authorization: `Bearer ${token}` }
		});
		const tasks = await response.json();
		if (!response.ok || !Array.isArray(tasks)) throw new Error('Unable to load tasks');

		const statuses = { Completed: 0, Pending: 0, 'In Progress': 0 };
		const priorities = { High: 0, Medium: 0, Low: 0 };

		tasks.forEach((task) => {
			statuses[statusGroup(task.status)] += 1;
			const priority = String(task.priority || 'Medium').toLowerCase();
			const label = priority.charAt(0).toUpperCase() + priority.slice(1);
			if (priorities[label] !== undefined) priorities[label] += 1;
		});

		totalTasks.textContent = tasks.length;
		completedTasks.textContent = statuses.Completed;
		pendingTasks.textContent = statuses.Pending;
		progressTasks.textContent = statuses['In Progress'];
		renderCharts(statuses, priorities);
	} catch (error) {
		console.error('Dashboard error:', error);
		window.location.href = '../../pages/errors/500.html'
	}
};

loadDashboard();
