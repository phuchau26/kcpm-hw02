# HW02 LaTeX report template

This is a content-free adaptation of the HW01 LaTeX layout. It retains the modular report architecture, typography, colors, headers, bibliography hook, and university logo. HW01 assignment content and personal evidence were not copied.

Compile from this directory with XeLaTeX because `preamble.tex` uses `fontspec` and system fonts:

```powershell
xelatex main.tex
bibtex main
xelatex main.tex
xelatex main.tex
```

The report sources contain the verified HW02 content and are compiled together with the bibliography and appendices.
