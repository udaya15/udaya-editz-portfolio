<?php
/**
 * getProjects() — returns the portfolio catalogue as an associative array.
 *
 * Real project list for Udaya Editz — all 6 clips are Short Form; the
 * "Videography & Editing" clip is also tagged Mobile Videography, so it
 * shows up under both filters. 'category' can hold more than one value
 * separated by a space, e.g. 'short mobile'.
 * Video files must be placed at the paths below, inside assets/video/,
 * using the EXACT filenames listed here (spaces included).
 *
 * 'orientation' defaults to 'vertical' since these are short-form
 * clips (reels/shorts style framing). If any of your actual files are
 * landscape/horizontal, just change that project's 'orientation' to
 * 'horizontal' and the card + modal will resize automatically.
 */
function getProjects(): array {
    return [
        [
            'title'       => 'Advertisement Edit',
            'category'    => 'short',
            'orientation' => 'vertical',
            'software'    => 'CapCut Pro',
            'timecode'    => '00:00:00:00 — 00:00:13:00',
            'swatch'      => 'linear-gradient(160deg,#1F2833,#0B0C10 70%)',
            'video'       => 'assets/video/Advertisment - Capcut.mp4',
        ],
        [
            'title'       => 'Color Grading Showcase',
            'category'    => 'short',
            'orientation' => 'vertical',
            'software'    => 'DaVinci Resolve',
            'timecode'    => '00:00:00:00 — 00:00:09:00',
            'swatch'      => 'linear-gradient(150deg,#16222a,#0b0c10 65%)',
            'video'       => 'assets/video/Color grading -Davinci Resolve.mp4',
        ],
        [
            'title'       => 'Kubiyo Edit',
            'category'    => 'short',
            'orientation' => 'vertical',
            'software'    => 'DaVinci Resolve',
            'timecode'    => '00:00:00:00 — 00:00:23:00',
            'swatch'      => 'linear-gradient(145deg,#1a2530,#0b0c10 70%)',
            'video'       => 'assets/video/kubiyo edit -Davinci Resolve.mp4',
        ],
        [
            'title'       => 'Mr. Sapuwa — Before & After Edit',
            'category'    => 'short',
            'orientation' => 'vertical',
            'software'    => 'DaVinci Resolve',
            'timecode'    => '00:00:00:00 — 00:00:17:00',
            'swatch'      => 'linear-gradient(160deg,#1c2a33,#0b0c10 70%)',
            'video'       => 'assets/video/Mr.Sapuwa Edit Before_After-Davinci Resolve.mp4',
        ],
        [
            'title'       => 'Sapuwa — StoryTelling Edit',
            'category'    => 'short',
            'orientation' => 'vertical',
            'software'    => 'DaVinci Resolve',
            'timecode'    => '00:00:00:00 — 00:00:19:00',
            'swatch'      => 'linear-gradient(150deg,#182228,#0b0c10 65%)',
            'video'       => 'assets/video/Sapuwa StoryTelling Edit -Davinci Resolve.mp4',
        ],
        [
            'title'       => 'Videography & Editing',
            'category'    => 'short mobile',
            'orientation' => 'vertical',
            'software'    => 'CapCut Pro',
            'timecode'    => '00:00:00:00 — 00:01:02:00',
            'swatch'      => 'linear-gradient(160deg,#1e2b34,#0b0c10 70%)',
            'video'       => 'assets/video/Videography and editing (Capcut).mp4',
        ],
    ];
}