import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import CardView from './components/cardview';
import Header from './components/header';
import Container from '@mui/material/Container';

function App() {
	// const [machines, setMachines] = React.useState<string[]>('');
	// const [current, setCurrent] = ...

	// useEffect(() => {
	// 	axios.get('/bot/info').then((ms) => {
	// 		setMachines(ms);
	// 	}).catch;
	// }, []);

	return (
		<>
			<Container maxWidth={false}>
				<Header />
				<br />
				<Container maxWidth='sm'>
					{/* {machines.map((m) => {
					CardView(m.asdasdasd);
				})} */}
					{/* <Grid></Grid> */}
					<CardView
						hostname='hugo'
						IP='127.0.0.1'
						cmdQueue={['ls', 'echo']}
						UUID={'uuid'}
						pollRate={5}
						changeFcn={() => {
							console.log('changed data');
							return true;
						}}
						status={true}
					/>
				</Container>
			</Container>
		</>
	);
}

export default App;
