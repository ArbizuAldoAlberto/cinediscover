/**
 * @file index.js
 * @description Entry point for the Expo application.
 * This file registers the root component and ensures the environment 
 * is correctly set up for both Expo Go and native builds.
 * 
 * AGENT 1: Professional Entry Point Documentation.
 */

import { registerRootComponent } from 'expo';
import App from './App';

/**
 * registerRootComponent calls AppRegistry.registerComponent('main', () => App);
 * It handles bundling and environment setup across Expo platforms.
 */
registerRootComponent(App);
