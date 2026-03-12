import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';

export interface MenuItem {
  name: string;
  icon: string;
  path: string;
  hasDropdown?: boolean;
  children?: MenuItem[];

  moduleKey?: string;     // NEW
  roles?: string[];       // NEW
  openInNewTab?: boolean; // NEW

}

export const MENU_ITEMS: MenuItem[] = [
  { name: 'Mimics', icon: 'settings', path: '/mimics', openInNewTab: false },
  { name: 'Data Download', icon: 'download', path: '/datadownload', openInNewTab: false },
  { name: 'Trends', icon: 'trend', path: "https://dev.d24ohd8z0zwg7d.amplifyapp.com/mimics/viewtrends", openInNewTab: false },
  {
    name: 'Report', icon: 'report', path: "/reports/reportList",
    openInNewTab: true
  },
  {
    name: 'Tag Utility', icon: 'link', path: "https://tag_utility.akxatechapps.com/",
    openInNewTab: true
  },
  {
    name: 'CBM', icon: 'wrench', path: '', hasDropdown: true, openInNewTab: false,

    children: [
      { name: 'Equipment Template', icon: '', path: '/cbm/templates', openInNewTab: false, },
      { name: 'Email Template', icon: '', path: '/cbm/EmailTemplateList', openInNewTab: false, },
      { name: 'Cyclone View List', icon: '', path: '/cbm/cyclonelist', openInNewTab: false, },
    ],
  },
  { name: 'Charts Visualization', icon: 'chart', path: "/mimics/chartspage", openInNewTab: false, },
  {
    name: 'Process Optimization', icon: 'cogs', path: '', hasDropdown: true,
    children: [
      { name: 'Blaine Prediction', icon: '', path: "/blaine/#/home", openInNewTab: false, },
      {
        name: 'Cement OPT', icon: '', path: '', hasDropdown: true, openInNewTab: false,
        children: [
          {
            name: "Home", icon: '',
            path: "/cement/#/home",
            moduleKey: "OPT",
            openInNewTab: false,
          },
          { name: 'Dashboard', icon: '', path: "/cement/#/dashboard", openInNewTab: false, },
          { name: 'Recommendation', icon: '', path: "/cement/#/recommendationsList", openInNewTab: false, },
          { name: 'Admin', icon: '', path: "/cement/#/adminpage", openInNewTab: false, },
        ],
      },
      {
        name: 'Kiln OPT', icon: '', path: '', hasDropdown: true, openInNewTab: false,
        children: [
          { name: 'Performance Dashboard', icon: '', path: '/klin/#/dashboard', openInNewTab: false, },
          { name: 'Process Dashboard', icon: '', path: '/klin/#/home', openInNewTab: false, },
          { name: 'Recommendations', icon: '', path: '/klin/#/recommendationsList', openInNewTab: false, },
          { name: 'Alerts', icon: '', path: '/klin/#/alertList', openInNewTab: false, },
          { name: 'Equipment', icon: '', path: '/klin/#/equipmentList', openInNewTab: false, },
          { name: 'Tag List', icon: '', path: '/klin/#/disturbanceOrder', openInNewTab: false, },
          { name: 'Admin Page', icon: '', path: '/klin/#/adminpage', openInNewTab: false, },
          { name: 'Control Range Page', icon: '', path: '/klin/#/controlRange', openInNewTab: false, },
        ],
      },
    ],
  },
  {
    name: 'Admin', icon: 'admin', path: '/dashboard/admin', hasDropdown: true, openInNewTab: false,
    children: [
      { name: 'User List', icon: '', path: '/admin/dashboard/datatable', roles: ["admin", "super_admin"] },
      { name: 'Access Logs', icon: '', path: '/admin/Dashboard/logs', roles: ["admin", "super_admin"] },
      { name: 'Sent Email Logs', icon: '', path: '/admin/Dashboard/emailLogs', roles: ["admin", "super_admin"] },
      { name: 'Alerts', icon: '', path: '/admin/Dashboard/mimicLineAlerts', roles: ["super_admin"] },
      { name: 'Alert For Blaine', icon: '', path: '/admin/Dashboard/blainealerts', roles: ["super_admin"] },
      { name: 'Alert For Kiln', icon: '', path: '/admin/Dashboard/kilnalerts', roles: ["super_admin"] },
      { name: 'Kiln Master', icon: '', path: '/admin/Dashboard/alltemplates', roles: ["super_admin"] },
      { name: 'Utilization', icon: '', path: '/admin/Dashboard/kilnmaster', roles: ["super_admin"] },
      { name: 'CBM Templates', icon: '', path: '/admin/Dashboard/utilization', roles: ["super_admin"] },
      { name: 'Settings', icon: '', path: '/admin/Dashboard/settings', roles: ["super_admin"] },
    ],
  },
];

export const SVG_WIDTH = 16;
export const SVG_HEIGHT = 33;
export const VERTICAL_LINE_X = 1.5;
export const LINE_WIDTH = 1.5;
export const MID_Y = SVG_HEIGHT / 2;
export const CURVE_START_Y = SVG_HEIGHT * 0.6875;
export const CURVE_END_Y = SVG_HEIGHT * 0.875;
export const CURVE_RADIUS = CURVE_END_Y - CURVE_START_Y;

@Component({
  selector: 'app-sidebr',
  templateUrl: './sidebr.component.html',
  styleUrls: ['./sidebr.component.scss'],
})
export class SidebrComponent implements OnInit {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  // ✅ REMOVED: theme = 'light'  ← was duplicate with getter below
  mounted = false;
  menuItems = MENU_ITEMS;
  filteredMenu: MenuItem[] = [];

  modules: string[] = [];
  role: string = '';
  currentPath = '';

  openDropdowns: Record<string, boolean> = {};

  SVG_WIDTH = SVG_WIDTH;
  SVG_HEIGHT = SVG_HEIGHT;
  VERTICAL_LINE_X = VERTICAL_LINE_X;
  LINE_WIDTH = LINE_WIDTH;
  MID_Y = MID_Y;
  CURVE_START_Y = CURVE_START_Y;
  CURVE_END_Y = CURVE_END_Y;
  CURVE_RADIUS = CURVE_RADIUS;

  constructor(private router: Router, public themeService: ThemeService) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => (this.currentPath = e.urlAfterRedirects));
  }

  // ✅ ONLY theme source — reads from ThemeService
  get theme(): string {
    return this.themeService.current;
  }

  // ngOnInit(): void {
  //   this.mounted = true;
  //   this.currentPath = this.router.url;
  //   // ✅ REMOVED: old localStorage + classList logic
  //   // ThemeService.init() in AppComponent handles theme restoration
  // }

  ngOnInit(): void {
    this.mounted = true;
    this.currentPath = this.router.url;

    // modules from localStorage
    const modules = localStorage.getItem('modules');
    this.modules = modules ? JSON.parse(modules) : [];

    // role from token/localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const parsed = JSON.parse(token);
      this.role = parsed?.Role || '';
    }

    this.applyMenuFiltering();
  }

  applyMenuFiltering(): void {

    this.filteredMenu = this.menuItems
      .filter((item) => {

        if (item.moduleKey === 'Admin') return true;

        if (item.moduleKey && !this.modules.includes(item.moduleKey)) {
          return false;
        }

        return true;
      })
      .map((item) => {

        if (!item.children) return item;

        let filteredChildren = item.children;

        if (item.moduleKey === 'Admin') {

          // role filtering
          filteredChildren = item.children.filter(
            child => !child.roles || child.roles.includes(this.role)
          );

        } else {

          // module filtering
          filteredChildren = item.children.filter(
            child => !child.moduleKey || this.modules.includes(child.moduleKey)
          );

        }

        return { ...item, children: filteredChildren };

      })
      .filter((item) => {

        if (item.children && item.children.length === 0) {
          return false;
        }

        return true;
      });
  }

  handleNavigation(item: MenuItem): void {

    if (!item.path) return;

    const fullUrl = item.path.startsWith('http')
      ? item.path
      : `${window.location.origin}${item.path}`;

    if (item.openInNewTab) {

      // open in new tab
      window.open(fullUrl, '_blank', 'noopener,noreferrer');

    } else {

      if (item.path.startsWith('http')) {

        // external link same tab
        window.location.href = fullUrl;

      } else {

        // angular internal route
        this.router.navigateByUrl(item.path);

      }

    }

    this.closeMobile();
  }


  isActiveRoute(path: string): boolean {
    return !!path && this.currentPath === path;
  }

  // ✅ Delegates fully to ThemeService
  toggleTheme(): void {
    this.themeService.toggle();
  }

  get lineColor(): string {
    return this.theme === 'dark' ? '#7E8383' : '#9FACAC';
  }

  closeMobile(): void {
    this.openChange.emit(false);
  }

  toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed);
  }

  toggleDropdown(key: string): void {
    this.openDropdowns[key] = !this.openDropdowns[key];
  }

  isDropdownOpen(key: string): boolean {
    return !!this.openDropdowns[key];
  }

  handleParentClick(item: MenuItem): void {
    if (!item.hasDropdown) return;
    if (this.collapsed) {
      this.collapsedChange.emit(false);
      setTimeout(() => this.toggleDropdown(item.name), 310);
    } else {
      this.toggleDropdown(item.name);
    }
  }

  getCurvedPath(): string {
    return `M ${VERTICAL_LINE_X} 0
            L ${VERTICAL_LINE_X} ${CURVE_START_Y}
            Q ${VERTICAL_LINE_X} ${CURVE_END_Y} ${VERTICAL_LINE_X + CURVE_RADIUS} ${CURVE_END_Y}
            L ${SVG_WIDTH} ${CURVE_END_Y}`;
  }

  isChildActive(children: MenuItem[] = [], currentPath: string): boolean {
    return children.some(
      (c) => currentPath === c.path || this.isChildActive(c.children ?? [], currentPath)
    );
  }

  getVerticalLineHeight(child: MenuItem, nestedOpen: boolean): string {
    if (nestedOpen && child.hasDropdown && child.children?.length) {
      return `${SVG_HEIGHT + child.children.length * SVG_HEIGHT}px`;
    }
    return `${SVG_HEIGHT}px`;
  }
}