        /* ==========================================================================
           WEB AUDIO API PROCEDURAL SCI-FI SOUND SYNTHESIZER
           ========================================================================== */
        let audioCtx = null;
        let sfxEnabled = true;

        function initAudio() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        // Subtle futuristic UI blip
        function playBeep(freq = 880, duration = 0.05, type = 'sine', gainVal = 0.04) {
            if (!sfxEnabled || !audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch (e) { }
        }

        // Hyperdrive warp sound effect
        function playWarpSound() {
            if (!sfxEnabled || !audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(90, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.8);
                gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.85);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.85);
            } catch (e) { }
        }

        // SFX Toggle & UI Synchronization
        const sfxToggleBtn = document.getElementById('sfx-toggle-btn');
        const sfxStatusEl = document.getElementById('sfx-status');
        const sfxIconEl = document.getElementById('sfx-icon');
        const sfxToggleBtnMobile = document.getElementById('sfx-toggle-btn-mobile');
        const sfxIconMobile = document.getElementById('sfx-icon-mobile');
        const drawerSfxBtn = document.getElementById('drawer-sfx-btn');
        const drawerSfxIcon = document.getElementById('drawer-sfx-icon');
        const drawerSfxStatus = document.getElementById('drawer-sfx-status');

        function updateAllSfxUI() {
            if (sfxStatusEl) {
                sfxStatusEl.textContent = sfxEnabled ? 'ON' : 'OFF';
                sfxStatusEl.style.color = sfxEnabled ? 'var(--red)' : '#666';
            }
            if (sfxIconEl) sfxIconEl.textContent = sfxEnabled ? '🔊' : '🔇';
            if (sfxIconMobile) sfxIconMobile.textContent = sfxEnabled ? '🔊' : '🔇';
            if (drawerSfxStatus) {
                drawerSfxStatus.textContent = sfxEnabled ? 'ON' : 'OFF';
                drawerSfxStatus.style.color = sfxEnabled ? 'var(--red)' : '#666';
            }
            if (drawerSfxIcon) drawerSfxIcon.textContent = sfxEnabled ? '🔊' : '🔇';
        }

        function toggleSfxState() {
            initAudio();
            sfxEnabled = !sfxEnabled;
            updateAllSfxUI();
            if (sfxEnabled) playBeep(920, 0.08);
        }

        if (sfxToggleBtn) sfxToggleBtn.addEventListener('click', toggleSfxState);
        if (sfxToggleBtnMobile) sfxToggleBtnMobile.addEventListener('click', toggleSfxState);
        if (drawerSfxBtn) drawerSfxBtn.addEventListener('click', toggleSfxState);

        /* ==========================================================================
           PARTICLE STARFIELD CANVAS (WITH WARP ACCELERATION)
           ========================================================================== */
        const starCanvas = document.getElementById('star-canvas');
        const ctx = starCanvas.getContext('2d');
        let stars = [];
        let starSpeed = 0.4;
        let warpMode = false;

        function resizeCanvas() {
            starCanvas.width = window.innerWidth;
            starCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function initStars() {
            stars = [];
            const count = Math.min(window.innerWidth > 800 ? 120 : 60, 150);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: (Math.random() - 0.5) * starCanvas.width,
                    y: (Math.random() - 0.5) * starCanvas.height,
                    z: Math.random() * starCanvas.width,
                    pz: 0
                });
            }
        }
        initStars();

        function animateStars() {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.28)';
            ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);

            const cx = starCanvas.width / 2;
            const cy = starCanvas.height / 2;
            const speed = warpMode ? 28 : starSpeed;

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.pz = s.z;
                s.z -= speed;

                if (s.z <= 0) {
                    s.z = starCanvas.width;
                    s.x = (Math.random() - 0.5) * starCanvas.width;
                    s.y = (Math.random() - 0.5) * starCanvas.height;
                    s.pz = s.z;
                }

                const k = 140 / s.z;
                const px = s.x * k + cx;
                const py = s.y * k + cy;

                if (px >= 0 && px <= starCanvas.width && py >= 0 && py <= starCanvas.height) {
                    const size = Math.max(0.6, (1 - s.z / starCanvas.width) * (warpMode ? 4 : 2));
                    const shade = Math.min(1, Math.max(0.1, 1 - s.z / starCanvas.width));

                    ctx.beginPath();
                    if (warpMode) {
                        const pk = 140 / s.pz;
                        const prevX = s.x * pk + cx;
                        const prevY = s.y * pk + cy;
                        ctx.strokeStyle = `rgba(255, 35, 45, ${shade * 0.8})`;
                        ctx.lineWidth = size;
                        ctx.moveTo(prevX, prevY);
                        ctx.lineTo(px, py);
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = i % 5 === 0 ? `rgba(255, 35, 45, ${shade * 0.9})` : `rgba(220, 220, 220, ${shade * 0.7})`;
                        ctx.arc(px, py, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            requestAnimationFrame(animateStars);
        }
        requestAnimationFrame(animateStars);

        /* ==========================================================================
           VIDEO INTRO GATE CONTROLS & TRANSITION
           ========================================================================== */
        const introGate = document.getElementById('intro-gate');
        const introVid = document.getElementById('intro-vid');
        const warpFlash = document.getElementById('warp-flash');
        const enterSiteBtn = document.getElementById('enter-site-btn');
        const skipTopBtn = document.getElementById('skip-top-btn');
        const soundBtn = document.getElementById('sound-btn');
        const soundLabel = document.getElementById('sound-label');
        const soundBars = document.getElementById('gate-sound-bars');
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');
        const progressFill = document.getElementById('gate-progress-fill');
        const progressBar = document.getElementById('gate-progress-bar');
        const replayIntroBtn = document.getElementById('replay-intro-btn');
        const footReplayBtn = document.getElementById('foot-replay-btn');

        function formatTime(secs) {
            if (isNaN(secs)) return '00:00';
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }

        // Update timecode & progress
        if (introVid) {
            introVid.addEventListener('timeupdate', () => {
                if (introVid.duration && progressFill) {
                    const pct = (introVid.currentTime / introVid.duration) * 100;
                    progressFill.style.width = pct + '%';
                    if (timeCurrent) timeCurrent.textContent = formatTime(introVid.currentTime);
                    if (timeTotal) timeTotal.textContent = formatTime(introVid.duration);
                }
            });

            // Auto-transition when video finishes or errors
            introVid.addEventListener('ended', dismissIntroGate);
            introVid.addEventListener('error', () => {
                // If video fails to load, gracefully dismiss gate
                dismissIntroGate();
            });
        }

        // Click progress bar to seek
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                if (introVid && introVid.duration) {
                    introVid.currentTime = clickPos * introVid.duration;
                }
            });
        }

        // Sound toggle for intro video
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                initAudio();
                if (introVid) {
                    introVid.muted = !introVid.muted;
                    if (soundLabel) soundLabel.textContent = introVid.muted ? 'UNMUTE' : 'MUTED';
                    if (soundBars) {
                        if (introVid.muted) soundBars.classList.add('muted');
                        else soundBars.classList.remove('muted');
                    }
                    if (!introVid.muted) introVid.play().catch(() => { });
                }
                playBeep(introVid && introVid.muted ? 440 : 880, 0.05);
            });
        }

        // Launch Warp Transition
        let isDismissed = false;
        function dismissIntroGate() {
            if (isDismissed) return;
            isDismissed = true;
            initAudio();
            playWarpSound();

            warpMode = true;
            if (warpFlash) warpFlash.classList.add('active');

            setTimeout(() => {
                if (introGate) introGate.classList.add('dismissed');
                if (introVid) introVid.pause();
            }, 220);

            setTimeout(() => {
                if (warpFlash) warpFlash.classList.remove('active');
                warpMode = false;
            }, 750);
        }

        if (enterSiteBtn) enterSiteBtn.addEventListener('click', dismissIntroGate);
        if (skipTopBtn) skipTopBtn.addEventListener('click', dismissIntroGate);

        // Keyboard shortcuts: Space or Escape to skip intro
        window.addEventListener('keydown', (e) => {
            if (!isDismissed && (e.code === 'Space' || e.code === 'Escape')) {
                e.preventDefault();
                dismissIntroGate();
            }
        });

        // Replay Intro Video Handler
        function replayIntro() {
            isDismissed = false;
            if (introGate) introGate.classList.remove('dismissed');
            if (introVid) {
                introVid.currentTime = 0;
                introVid.play().catch(() => { });
            }
            initAudio();
            playBeep(780, 0.08);
        }

        if (replayIntroBtn) {
            replayIntroBtn.addEventListener('click', replayIntro);
        }
        if (footReplayBtn) {
            footReplayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                replayIntro();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        /* ==========================================================================
           CURSOR GLOW & 3D PARALLAX
           ========================================================================== */
        const glow = document.getElementById('glow');
        const hero = document.getElementById('hero');

        if (glow) {
            window.addEventListener('pointermove', (e) => {
                glow.style.left = e.clientX + 'px';
                glow.style.top = e.clientY + 'px';
                if (hero && window.innerWidth > 820) {
                    const x = (e.clientX / window.innerWidth - 0.5) * 8;
                    const y = (e.clientY / window.innerHeight - 0.5) * 8;
                    hero.style.transform = `rotateY(${x * 0.28}deg) rotateX(${-y * 0.28}deg)`;
                }
            });
        }

        // 3D Card Tilt
        document.querySelectorAll('.tilt').forEach(c => {
            c.addEventListener('pointermove', e => {
                if (window.innerWidth <= 820) return;
                const r = c.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                c.style.transform = `perspective(800px) rotateX(${-(y / r.height - 0.5) * 8}deg) rotateY(${(x / r.width - 0.5) * 8}deg) translateY(-5px)`;
            });
            c.addEventListener('pointerleave', () => c.style.transform = '');
            c.addEventListener('mouseenter', () => playBeep(1200, 0.03, 'sine', 0.02));
        });

        // Interactive Logo Disc click speed-up
        const logoDisc = document.getElementById('interactive-logo-disc');
        if (logoDisc) {
            logoDisc.addEventListener('click', () => {
                initAudio();
                playBeep(1100, 0.1, 'triangle', 0.08);
                logoDisc.style.animationDuration = '2s';
                setTimeout(() => {
                    logoDisc.style.animationDuration = '11s';
                }, 4000);
            });
        }

        /* ==========================================================================
           INTERSECTION OBSERVER REVEAL & NUMBER COUNTERS
           ========================================================================== */
        let countersStarted = false;
        function startCounters() {
            if (countersStarted) return;
            countersStarted = true;
            document.querySelectorAll('.counter').forEach(cnt => {
                const target = +cnt.getAttribute('data-target');
                let cur = 0;
                const step = Math.max(1, Math.floor(target / 40));
                const timer = setInterval(() => {
                    cur += step;
                    if (cur >= target) {
                        cnt.textContent = target + (target === 14 ? '+' : target === 1200 ? '+' : '%');
                        clearInterval(timer);
                    } else {
                        cnt.textContent = cur;
                    }
                }, 30);
            });
        }

        const reveals = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        if (entry.target.querySelector && entry.target.querySelector('.counter')) {
                            startCounters();
                        }
                    }
                });
            }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

            reveals.forEach(el => io.observe(el));
        } else {
            reveals.forEach(el => el.classList.add('show'));
        }

        /* ==========================================================================
           TEAM FILTERING (8 TEAM MEMBERS)
           ========================================================================== */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const memberCards = document.querySelectorAll('.member-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                initAudio();
                playBeep(700, 0.04);
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                memberCards.forEach(card => {
                    const cats = card.getAttribute('data-category') || '';
                    if (filter === 'all' || cats.includes(filter)) {
                        card.style.display = 'flex';
                        setTimeout(() => card.classList.add('show'), 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('show');
                    }
                });
            });
        });

        /* ==========================================================================
           TECH SPECS TABS
           ========================================================================== */
        const specBtns = document.querySelectorAll('.spec-tab-btn');
        const specPanels = document.querySelectorAll('.spec-panel');

        specBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                initAudio();
                playBeep(850, 0.05);
                specBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tabId = btn.getAttribute('data-tab');
                specPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `tab-${tabId}`) {
                        panel.classList.add('active');
                    }
                });
            });
        });

        /* ==========================================================================
           "MEET THE CREW" INTERACTIVE NAVIGATION & SHOW ALL MEMBERS
           ========================================================================== */
        function triggerMeetTheCrew() {
            initAudio();
            playBeep(980, 0.08, 'triangle', 0.08);

            // 1. Reset filter to ALL CREW
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) {
                filterBtns.forEach(b => b.classList.remove('active'));
                allBtn.classList.add('active');
            }

            // 2. Ensure every member card is displayed
            memberCards.forEach(card => {
                card.style.display = 'flex';
                card.classList.add('show');
            });

            // 3. Smooth scroll to the Crew Roster section
            const teamSec = document.getElementById('team');
            if (teamSec) {
                teamSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                teamSec.classList.add('crew-highlight-pulse');
                setTimeout(() => {
                    teamSec.classList.remove('crew-highlight-pulse');
                }, 2000);
            }
        }

        // Attach to all "Meet the Crew" buttons & links
        document.querySelectorAll('.meet-the-crew-btn, .navcta, a[href="#team"]').forEach(el => {
            el.addEventListener('click', (e) => {
                triggerMeetTheCrew();
            });
        });

        /* ==========================================================================
           PHOTO PREVIEW HELPER MODAL LOGIC (8 MEMBERS)
           ========================================================================== */
        const photoModal = document.getElementById('photo-modal');
        const openPhotoToolBtn = document.getElementById('open-photo-tool-btn');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalDropzone = document.getElementById('modal-dropzone');
        const modalFileInput = document.getElementById('modal-file-input');
        const previewMemberSelect = document.getElementById('preview-member-select');

        if (openPhotoToolBtn && photoModal) {
            openPhotoToolBtn.addEventListener('click', () => {
                initAudio();
                playBeep(800, 0.05);
                photoModal.classList.add('open');
            });
        }
        if (modalCloseBtn && photoModal) {
            modalCloseBtn.addEventListener('click', () => {
                photoModal.classList.remove('open');
            });
        }
        if (photoModal) {
            photoModal.addEventListener('click', (e) => {
                if (e.target === photoModal) photoModal.classList.remove('open');
            });
        }

        if (modalDropzone && modalFileInput) {
            modalDropzone.addEventListener('click', () => modalFileInput.click());

            modalDropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                modalDropzone.style.borderColor = 'var(--red)';
            });
            modalDropzone.addEventListener('dragleave', () => {
                modalDropzone.style.borderColor = '';
            });
            modalDropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                modalDropzone.style.borderColor = '';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    modalFileInput.files = e.dataTransfer.files;
                    modalFileInput.dispatchEvent(new Event('change'));
                }
            });
        }

        if (modalFileInput && previewMemberSelect) {
            modalFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const targetId = previewMemberSelect.value;
                        const targetCard = document.querySelector(`.member-card[data-member-id="${targetId}"]`) ||
                            (targetId === 'tc-09' ? document.querySelector('.member-card[data-member-id="nubaid"]') : null);
                        if (targetCard) {
                            const img = targetCard.querySelector('.member-img');
                            if (img) {
                                img.src = evt.target.result;
                                playBeep(1100, 0.08);
                                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                targetCard.style.boxShadow = '0 0 40px var(--red)';
                                setTimeout(() => targetCard.style.boxShadow = '', 2000);
                            }
                        }
                        if (photoModal) photoModal.classList.remove('open');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        /* ==========================================================================
           MOBILE NAVIGATION DRAWER LOGIC
           ========================================================================== */
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
        const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
        const mobileNavClose = document.getElementById('mobile-nav-close');
        const drawerLinks = document.querySelectorAll('.drawer-link');
        const drawerReplayBtn = document.getElementById('drawer-replay-btn');

        function openMobileMenu() {
            initAudio();
            playBeep(880, 0.04);
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            }
            if (mobileNavDrawer) {
                mobileNavDrawer.classList.add('open');
                mobileNavDrawer.setAttribute('aria-hidden', 'false');
            }
            if (mobileNavBackdrop) mobileNavBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            if (mobileNavDrawer) {
                mobileNavDrawer.classList.remove('open');
                mobileNavDrawer.setAttribute('aria-hidden', 'true');
            }
            if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
        }
        if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileMenu);
        if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileMenu);

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        if (drawerReplayBtn) {
            drawerReplayBtn.addEventListener('click', () => {
                closeMobileMenu();
                replayIntro();
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
                closeMobileMenu();
            }
        });
