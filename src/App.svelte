<script>
	import { JDate } from 'ponomar';
	import cities from './cities.js';
	import Datepicker from 'svelte-calendar';
	import { dateMMDDYYYY, parseMMDDYYYY, getTZoffset } from './util.js';

	const API_KEY = 'AIzaSyDrfmgFWRh8FdeKvsXHOtFapspnxlDk0Hc';

	cities.sort( (a, b) => {
		return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
	});

	let {lon, lat, name} = cities[0];
	let tzoffset = 0;  // TBD soon via Google Timezone API
	let observation = 'default';

	const observations = [
		{ title: 'Sunrise/sunset', value: 'default'},
		{ title: 'Civil twilight', value: 'civil'},
		{ title: 'Nautical twilight', value: 'nautical'},
		{ title: 'Amature astronomer twilight', value: 'amature'},
		{ title: 'Astronomical twilight', value: 'astronomical'},
	];

	let sunrise, sunset;

	let dateSelected = dateMMDDYYYY();
	let {year, month, day} = parseMMDDYYYY(dateSelected);

	$: ({year, month, day} = parseMMDDYYYY(dateSelected));

	$: [sunrise, sunset] =
		JDate.fromGregorian({ year, month, day }).getSunriseSunset(lon, lat, { tzoffset, observation });

	async function getTZ(x) {
		tzoffset = await getTZoffset(x);
	}
	let promise;
	$: promise = getTZ({lon, lat, year, month, day, api_key: API_KEY});

</script>

<style>
.stress {
	color: darkgreen;
}
</style>

<h1>Local Sunrise/Sunset times</h1>

<p>Lattitude: {lat}</p>
<p>Longtitude: {lon}</p>
<p>TZ offset: {tzoffset}</p>

<Datepicker bind:formattedSelected={dateSelected} dateChosen={true}>
	<button class='custom-button'>{dateSelected}</button>
</Datepicker>

<select bind:value={observation}>
	{#each observations as o}
		<option value={o.value}>{o.title}</option>
    {/each }
</select>

{#await promise}
	<h1>{name}: ...</h1>
{:then}
	<h1>{name}: <span class="stress">{sunrise} &ndash; {sunset}</span></h1>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

{#each cities as city}
	<button on:click={e=>({lon,lat,name}=city)}>{city.name}</button>
{/each}
