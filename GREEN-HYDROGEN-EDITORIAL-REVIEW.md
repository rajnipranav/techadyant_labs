# Editorial Review — Green Hydrogen Report

## Scope
- File: `Techadyant_Labs_Green_Hydrogen_Report.docx`
- Package folder: `D:\techadyant\labs_techadyant\Reports and DPR\In-progress\06_Industrial & Deep Tech\Techadyant_Labs_Green_Hydrogen_Report_Package\`
- Web figures copied to: `public/figures/india-green-hydrogen/`

## Review Findings

### 1. Figure Numbering Mismatch
**Severity: High**
- The document body uses chapter-relative numbering: Figure 1.1, Figure 2.1, Figure 3.1, Figure 3.2, Figure 4.1, Figure 6.1, Figure 6.2, Figure 7.1, Figure 7.2, Figure 8.1, Figure 8.2, Figure 9.1, Figure 10.1, Figure 11.1, Figure 12.1, Figure 12.2, Figure 13.1, Figure 14.1, Figure 15.1, Figure 16.1
- The List of Figures uses flat numbering: Figure 1 through Figure 24
- The List of Figures does not include all figures referenced in the body (e.g., Figure 5.1, Figure 7.1, Figure 7.2 are missing from the LOF)
- SVG asset filenames use flat numbering: fig01 through fig24
- Recommendation: Use consistent flat numbering throughout, or remove chapter prefixes from body references

### 2. Key Insight Placement Issue
**Severity: High**
- Each figure has a separate "Key insight: ..." paragraph immediately after the figure caption
- These Key Insight blocks appear as standalone text blocks below figures, creating visual clutter
- The user wants Key Insights removed from below figure headings and kept only in captions
- Recommendation: Merge the Key Insight text into the figure caption paragraph and remove the standalone "Key insight:" block

### 3. Caption Format Issue
**Severity: Medium**
- Current format: `Figure X.Y — Caption text`
- User requested: Remove figure numbers from headings
- Recommendation: Use clean captions without figure numbers, e.g., just `Caption text`

### 4. Missing Source Attribution Consistency
**Severity: Medium**
- Source paragraphs appear after each figure/table but are inconsistently formatted
- Some sources are truncated with "[...]" indicating they may be incomplete
- Recommendation: Standardize source attribution format across all figures

### 5. Table Numbering Consistency
**Severity: Medium**
- Tables use flat numbering (Table 2.1, Table 3.1, Table 4.1, etc.) which is consistent
- However, the List of Tables uses flat numbering (Table 1 through Table 24) which matches
- This is acceptable but should be verified against actual table count

### 6. Figure-Title Mismatch in SVG Assets
**Severity: Low**
- SVG filenames use flat numbering (fig01-fig24)
- Document body uses chapter-relative numbering
- The SVG asset folder has all 24 figures present
- Recommendation: Ensure the final figure numbering system matches the SVG filenames

## Required Edits

### Edit 1: Remove Figure Numbers from Captions
For each figure caption in the document body, remove the "Figure X.Y — " prefix and keep only the caption text.

### Edit 2: Remove Key Insight Blocks Below Figures
For each figure, locate the paragraph starting with "Key insight:" immediately after the figure and remove it entirely.

### Edit 3: Update Figure References in Body Text
Ensure all "see Figure X.Y" references in body text are updated to match the final numbering system.

### Edit 4: Regenerate List of Figures
Update the List of Figures to match the final numbering system and include all figures.

## Files Prepared
- Web assets copied to `public/figures/india-green-hydrogen/` (24 SVG files)
- Editorial review saved to `D:\techadyant\labs_techadyant\techadyant_labs-main\GREEN-HYDROGEN-EDITORIAL-REVIEW.md`

## Next Steps
1. Confirm the preferred figure numbering system (flat or chapter-relative)
2. Apply the caption and Key Insight fixes
3. Update all cross-references
4. Regenerate List of Figures
5. Rebuild and verify
