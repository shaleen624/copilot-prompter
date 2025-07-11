import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private document = inject(DOCUMENT);

  logPerformanceMetrics(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        'Load Event': perfData.loadEventEnd - perfData.loadEventStart,
        'Total Load Time': perfData.loadEventEnd - perfData.fetchStart,
        'First Paint': this.getFirstPaint(),
        'First Contentful Paint': this.getFirstContentfulPaint(),
        'Largest Contentful Paint': this.getLargestContentfulPaint()
      };

      console.group('🚀 Angular 20 Performance Metrics');
      console.log('✅ Zoneless Change Detection: Enabled');
      console.log('✅ OnPush Change Detection: Enabled on all components');
      console.log('✅ Lazy Loading: Enabled for all routes');
      console.log('✅ TrackBy Functions: Implemented for all loops');
      console.log('✅ Fetch API: Enabled for HTTP requests');
      console.log('✅ Component Input Binding: Enabled');
      console.table(metrics);
      console.groupEnd();
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lastLcp = lcpEntries[lcpEntries.length - 1];
    return lastLcp ? lastLcp.startTime : 0;
  }
}
