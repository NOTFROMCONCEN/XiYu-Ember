/**
 * 进度条管理模块
 * 负责所有加载进度指示功能
 * @author Huameitang
 */

export class ProgressBarManager {
    constructor() {
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = 0;
        this.loadingItems = new Set();
    }

    initialize() {
        if (!this.progressBar) {
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'progress-bar';
            document.body.appendChild(this.progressBar);
        }
    }

    addLoadingItem(id) {
        this.loadingItems.add(id);
        this.updateProgress();
    }

    removeLoadingItem(id) {
        this.loadingItems.delete(id);
        this.updateProgress();
    }

    updateProgress() {
        const totalItems = this.loadingItems.size;
        if (totalItems === 0) {
            this.completeProgress();
            return;
        }

        const newProgress = 100 - (this.loadingItems.size * 10);
        this.setProgress(Math.max(newProgress, 0));
    }

    setProgress(value) {
        this.progress = value;
        requestAnimationFrame(() => {
            if (this.progressBar) {
                this.progressBar.style.width = `${this.progress}%`;
                this.progressBar.style.opacity = this.progress >= 100 ? '0' : '1';
            }
        });
    }

    completeProgress() {
        this.setProgress(100);
        setTimeout(() => {
            if (this.progressBar) {
                this.progressBar.style.opacity = '0';
                setTimeout(() => {
                    if (this.progressBar) {
                        this.progressBar.style.display = 'none';
                    }
                }, 300);
            }
        }, 200);
    }

    reset() {
        this.loadingItems.clear();
        this.progress = 0;
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
            this.progressBar.style.opacity = '1';
            this.progressBar.style.display = 'block';
        }
    }
}

export const progressBar = new ProgressBarManager();
