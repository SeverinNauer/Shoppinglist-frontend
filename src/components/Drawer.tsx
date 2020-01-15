import React from "react";
import {
  makeStyles,
  createStyles,
  Theme,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Hidden,
  Drawer as MuiDrawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useAuthenticationReducer } from "../hooks/useAuthentication";
import { useGlobalStateReducer } from "../hooks/useGlobalState";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    logoutButton: {
      marginLeft: "auto"
    },
    title:{
      "&:hover":{
        cursor: "pointer"
      }
    }
  })
);

const Drawer: React.FC = props => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dispatch = useAuthenticationReducer();
  const globalStateDispatch = useGlobalStateReducer();

  const logout = () => {
    dispatch({ type: "removeToken" });
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <Typography variant="h6">Favoriten</Typography>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap onClick={() => globalStateDispatch({type: "removeShoppingList"})}>
            Einkaufsliste
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            className={classes.logoutButton}
            onClick={logout}
          >
            Ausloggen
          </Button>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <MuiDrawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </MuiDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <MuiDrawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </MuiDrawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
};

export default Drawer;
