/**
 * QuizVerse - Mock Firebase & Real-time Sync Configuration
 * Improved for Nested Path Support
 */

(function() {
    if (window.QuizVerse) return;

    const readStoredUser = () => {
        try {
            return JSON.parse(localStorage.getItem('quizverse_user'));
        } catch (e) {
            console.warn("Invalid stored user data:", e);
            return null;
        }
    };

    class MockDatabase {
        constructor() {
            this.callbacks = {};
            this.channel = typeof BroadcastChannel !== 'undefined'
                ? new BroadcastChannel('quizverse_db')
                : null;

            if (this.channel) {
                this.channel.onmessage = (event) => {
                    const { path, data } = event.data;
                    this.triggerCallbacks(path, data);
                };
            }
        }

        triggerCallbacks(updatedPath, data) {
            Object.keys(this.callbacks).forEach(path => {
                // If the updated path is a parent of the listener path, or vice versa
                if (path === updatedPath || path.startsWith(updatedPath + '/') || updatedPath.startsWith(path + '/')) {
                    const freshData = this.getVal(path);
                    this.callbacks[path].forEach(cb => cb(freshData));
                }
            });
        }

        setVal(path, data) {
            localStorage.setItem(`db_${path}`, JSON.stringify(data));
            
            // If we're setting a sub-path, we should also update the parent object in localStorage if it exists
            const segments = path.split('/');
            if (segments.length > 1) {
                let currentPath = segments[0];
                for (let i = 1; i < segments.length; i++) {
                    const parentData = this.getVal(currentPath);
                    if (parentData && typeof parentData === 'object') {
                        const childKey = segments[i];
                        // If it's the last segment, set the actual data
                        if (i === segments.length - 1) {
                            parentData[childKey] = data;
                        } else {
                            // Otherwise ensure the next segment is an object
                            parentData[childKey] = parentData[childKey] || {};
                        }
                        localStorage.setItem(`db_${currentPath}`, JSON.stringify(parentData));
                    }
                    currentPath += '/' + segments[i];
                }
            }

            if (this.channel) this.channel.postMessage({ path, data });
            this.triggerCallbacks(path, data);
        }

        getVal(path) {
            const direct = localStorage.getItem(`db_${path}`);
            if (direct) return JSON.parse(direct);
            
            const segments = path.split('/');
            for (let i = segments.length - 1; i > 0; i--) {
                const parentPath = segments.slice(0, i).join('/');
                const subPath = segments.slice(i);
                const parentDataRaw = localStorage.getItem(`db_${parentPath}`);
                if (parentDataRaw) {
                    let obj = JSON.parse(parentDataRaw);
                    for (const key of subPath) {
                        if (obj && typeof obj === 'object') obj = obj[key];
                        else { obj = undefined; break; }
                    }
                    if (obj !== undefined) return obj;
                }
            }
            return null;
        }

        onValue(path, callback) {
            if (!this.callbacks[path]) this.callbacks[path] = [];
            this.callbacks[path].push(callback);
            callback(this.getVal(path));
        }
    }

    const mockDb = new MockDatabase();

    window.QuizVerse = {
        isMock: true,
        auth: {
            currentUser: readStoredUser()
        },
        ref: (db, path) => path,
        set: async (path, value) => {
            mockDb.setVal(path, value);
            return Promise.resolve();
        },
        update: async (path, value) => {
            const current = mockDb.getVal(path) || {};
            const updated = { ...current, ...value };
            mockDb.setVal(path, updated);
            return Promise.resolve();
        },
        get: async (path) => {
            const data = mockDb.getVal(path);
            return Promise.resolve({ exists: () => data !== null, val: () => data });
        },
        onValue: (path, callback) => {
            mockDb.onValue(path, (data) => {
                callback({ val: () => data });
            });
        },
        increment: (val) => (prev = 0) => prev + val
    };

    console.log("🚀 QuizVerse Mock Architecture Ready");
})();
