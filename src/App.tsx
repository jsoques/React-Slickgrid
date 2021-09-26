import React, { useEffect } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './App.css';
import Grid1 from './components/Grid1';
import Grid1b from './components/Grid1b';
import Grid2 from './components/Grid2';
import Grid3 from './components/Grid3';
import Grid4 from './components/Grid4';
import Grid5 from './components/Grid5';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

//const options = ['1 Basic Grids', '2 Grouping and Aggregators'];

interface Props {}

const App = (props: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sample, setSample] = React.useState(<></>);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    const el: HTMLElement = event.target;
    console.log(el.getAttribute('data-sample'));
    const sample = Number(el.getAttribute('data-sample'));
    switch (sample) {
      case 1:
        setSample(
          <>
            <h3 className="gridtitle is-3" style={{ marginLeft: '16px' }}>
              Example 01 - Basic Grids
            </h3>
            <Grid1 />
            <Grid1b />
          </>
        );
        break;
      case 2:
        setSample(
          <>
            <Grid2 />
          </>
        );
        break;
      case 3:
        setSample(
          <>
            <Grid3 />
          </>
        );
        break;
      case 4:
        setSample(
          <>
            <Grid4 />
          </>
        );
        break;
      case 5:
        setSample(
          <>
            <Grid5 />
          </>
        );
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    setSample(
      <>
        <h3 className="gridtitle is-3" style={{ marginLeft: '16px' }}>
          Example 01 - Basic Grids
        </h3>
        <Grid1 />
        <Grid1b />
      </>
    );
    return () => {
      console.log('Do clean up here...');
    };
  }, []);

  return (
    <div className={classes.root}>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem id="s1" data-sample="1" onClick={handleClose}>
          1 Basic Grids
        </MenuItem>
        <MenuItem id="s2" data-sample="2" onClick={handleClose}>
          2 Grouping and Aggregators
        </MenuItem>
        <MenuItem id="s3" data-sample="3" onClick={handleClose}>
          3 Draggable Grouping
        </MenuItem>
        <MenuItem id="s4" data-sample="4" onClick={handleClose}>
          4 Pinned (frozen) Columns/Rows
        </MenuItem>
        <MenuItem id="s5" data-sample="5" onClick={handleClose}>
          5 Tree Data with Parent/Child refs
        </MenuItem>
      </Menu>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ReSlickgrid...Slickgrid in React
          </Typography>
        </Toolbar>
      </AppBar>
      <header className="App-header">
        <div className="demo-container container is-fluid">{sample}</div>
      </header>
    </div>
  );
};

export default App;
