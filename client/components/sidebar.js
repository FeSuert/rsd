import Button from "./Button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

const SideBar = () => {
  const location = useRouter().pathname;

  return (
  <div class="header-container">
    <div class="logo-container">
      <Link class="logo-link" href="/">
        <span>
          <Image width="200" height="200" alt="logo" src="/imgs/logo.png"/>
        </span>
      </Link>
    </div>
    <div class="address-container">
      <li class="address-item">
        <div class="address-icon-container">
          <div class="address-icon">
            <canvas width="36" height="36">
            </canvas>
          </div>
        </div>
        <div class="address-details">
          <h6 class="address-title">
            0xbcD2...29a1
          </h6>
          <p class="address-status">
            Connected
          </p>
        </div>
      </li>
    </div>
    <ul class="nav-list">
      <Link class={`${location=="/" ? 'Mui-selected' : ''} nav-item`} href="/">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AutoAwesomeMosaicRoundedIcon">
            <path d="M3 5v14c0 1.1.89 2 2 2h6V3H5c-1.11 0-2 .9-2 2zm16-2h-6v8h8V5c0-1.1-.9-2-2-2zm-6 18h6c1.1 0 2-.9 2-2v-6h-8v8z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            Dashboard
          </h6>
        </div>
      </Link>
      <Link class={`${location=="/sendstream" ? 'Mui-selected' : ''} nav-item`} href="/sendstream">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowRightAltRoundedIcon">
            <path d="M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            Send Stream
          </h6>
        </div>
      </Link>
      <Link class={`${location=="/wrap" ? 'Mui-selected' : ''} nav-item`} href="/wrap">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ControlPointDuplicateOutlinedIcon">
            <path d="M16 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM2 12c0-2.79 1.64-5.2 4.01-6.32V3.52C2.52 4.76 0 8.09 0 12s2.52 7.24 6.01 8.48v-2.16C3.64 17.2 2 14.79 2 12zm13-9c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            Wrap / Unwrap
          </h6>
        </div>
      </Link>
      <Link class={`${location=="/bridge" ? 'Mui-selected' : ''} nav-item`} href="/bridge">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LooksRoundedIcon">
            <path d="M12 10c-3.47 0-6.36 2.54-6.91 5.86-.1.6.39 1.14 1 1.14.49 0 .9-.36.98-.85C7.48 13.79 9.53 12 12 12s4.52 1.79 4.93 4.15c.08.49.49.85.98.85.61 0 1.09-.54.99-1.14C18.36 12.54 15.47 10 12 10zm0-4C6.3 6 1.61 10.34 1.05 15.9c-.05.59.41 1.1 1.01 1.1.51 0 .94-.38.99-.88C3.49 11.57 7.34 8 12 8s8.51 3.57 8.96 8.12c.05.5.48.88.99.88.59 0 1.06-.51 1-1.1C22.39 10.34 17.7 6 12 6z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            Bridge
          </h6>
        </div>
      </Link>
      <Link class={`${location=="/history" ? 'Mui-selected' : ''} nav-item`} href="/history">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HistoryRoundedIcon">
            <path d="M13.26 3C8.17 2.86 4 6.95 4 12H2.21c-.45 0-.67.54-.35.85l2.79 2.8c.2.2.51.2.71 0l2.79-2.8c.31-.31.09-.85-.36-.85H6c0-3.9 3.18-7.05 7.1-7 3.72.05 6.85 3.18 6.9 6.9.05 3.91-3.1 7.1-7 7.1-1.61 0-3.1-.55-4.28-1.48-.4-.31-.96-.28-1.32.08-.42.42-.39 1.13.08 1.49C9 20.29 10.91 21 13 21c5.05 0 9.14-4.17 9-9.26-.13-4.69-4.05-8.61-8.74-8.74zm-.51 5c-.41 0-.75.34-.75.75v3.68c0 .35.19.68.49.86l3.12 1.85c.36.21.82.09 1.03-.26.21-.36.09-.82-.26-1.03l-2.88-1.71v-3.4c0-.4-.34-.74-.75-.74z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            Activity History
          </h6>
        </div>
      </Link>
      <Link class={`${location=="/safes" ? 'Mui-selected' : ''} nav-item`} href="/safes">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AutoStoriesOutlinedIcon">
            <path d="M22.47 5.2c-.47-.24-.96-.44-1.47-.61v12.03c-1.14-.41-2.31-.62-3.5-.62-1.9 0-3.78.54-5.5 1.58V5.48C10.38 4.55 8.51 4 6.5 4c-1.79 0-3.48.44-4.97 1.2-.33.16-.53.51-.53.88v12.08c0 .58.47.99 1 .99.16 0 .32-.04.48-.12C3.69 18.4 5.05 18 6.5 18c2.07 0 3.98.82 5.5 2 1.52-1.18 3.43-2 5.5-2 1.45 0 2.81.4 4.02 1.04.16.08.32.12.48.12.52 0 1-.41 1-.99V6.08c0-.37-.2-.72-.53-.88zM10 16.62C8.86 16.21 7.69 16 6.5 16s-2.36.21-3.5.62V6.71C4.11 6.24 5.28 6 6.5 6c1.2 0 2.39.25 3.5.72v9.9zM19 .5l-5 5V15l5-4.5V.5z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            My safes
          </h6>
        </div>
      </Link>
      <Link class={`${location=="/ecosystem" ? 'Mui-selected' : ''} nav-item`} href="/ecosystem">
        <div class="nav-icon">
          <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AppsRoundedIcon">
            <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z">
            </path>
          </svg>
        </div>
        <div class="nav-text">
          <h6 class="nav-link-title">
            Ecosystem
          </h6>
        </div>
      </Link>
    </ul>
    <div class="css-16ufse0">
      <div class="css-1rbrapn">
        <div class="nav-item">
          <div class="nav-icon">
            <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreHorizIcon">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
              </path>
            </svg>
          </div>
          <div class="nav-text">
            <h6 class="nav-link-title">
              More
            </h6>
          </div>
        </div>
        <div class="nav-item">
          <div class="css-6as02q">
            <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall svg-icon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SettingsRoundedIcon">
              <path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23c-.25-.44-.79-.62-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41c-.02.22-.03.44-.03.67s.01.45.03.68l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">
              </path>
            </svg>
          </div>
          <div class="nav-text">
            <h6 class="nav-link-title">
              Settings
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
};

export default SideBar;
