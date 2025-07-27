let experienceCount = 1;
let educationCount = 1;

function addExperience() {
  experienceCount++;
  const container = document.getElementById('experienceContainer');
  const experienceItem = document.createElement('div');
  experienceItem.className = 'experience-item';
  experienceItem.innerHTML = `
    <button type="button" class="remove-btn" onclick="removeExperience(this)">×</button>
    <div class="form-group">
      <label for="jobTitle${experienceCount}">Job Title:</label>
      <input type="text" id="jobTitle${experienceCount}" name="jobTitle${experienceCount}" placeholder="e.g., Software Developer">
    </div>
    <div class="form-group">
      <label for="company${experienceCount}">Company:</label>
      <input type="text" id="company${experienceCount}" name="company${experienceCount}" placeholder="Company Name">
    </div>
    <div class="form-group">
      <label for="location${experienceCount}">Location:</label>
      <input type="text" id="location${experienceCount}" name="location${experienceCount}" placeholder="City, State">
    </div>
    <div class="form-group">
      <label for="duration${experienceCount}">Duration:</label>
      <input type="text" id="duration${experienceCount}" name="duration${experienceCount}" placeholder="Jan 2020 - Present">
    </div>
    <div class="form-group">
      <label for="responsibilities${experienceCount}">Key Responsibilities & Achievements:</label>
      <textarea id="responsibilities${experienceCount}" name="responsibilities${experienceCount}" placeholder="• Bullet point 1&#10;• Bullet point 2&#10;• Bullet point 3"></textarea>
    </div>
  `;
  container.appendChild(experienceItem);
}

function removeExperience(button) {
  button.parentElement.remove();
}

function addEducation() {
  educationCount++;
  const container = document.getElementById('educationContainer');
  const educationItem = document.createElement('div');
  educationItem.className = 'education-item';
  educationItem.innerHTML = `
    <button type="button" class="remove-btn" onclick="removeEducation(this)">×</button>
    <div class="form-group">
      <label for="degree${educationCount}">Degree:</label>
      <input type="text" id="degree${educationCount}" name="degree${educationCount}" placeholder="e.g., Bachelor of Science in Computer Science">
    </div>
    <div class="form-group">
      <label for="school${educationCount}">School/University:</label>
      <input type="text" id="school${educationCount}" name="school${educationCount}" placeholder="University Name">
    </div>
    <div class="form-group">
      <label for="graduationYear${educationCount}">Graduation Year:</label>
      <input type="text" id="graduationYear${educationCount}" name="graduationYear${educationCount}" placeholder="2020">
    </div>
    <div class="form-group">
      <label for="gpa${educationCount}">GPA (optional):</label>
      <input type="text" id="gpa${educationCount}" name="gpa${educationCount}" placeholder="3.8/4.0">
    </div>
    <div class="form-group">
      <label for="honors${educationCount}">Honors/Awards (optional):</label>
      <input type="text" id="honors${educationCount}" name="honors${educationCount}" placeholder="Magna Cum Laude, Dean's List">
    </div>
  `;
  container.appendChild(educationItem);
}

function removeEducation(button) {
  button.parentElement.remove();
}

function generatePDF() {
  const button = document.querySelector('.generate-btn');
  button.classList.add('loading');
  
  // Get personal information
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const linkedin = document.getElementById('linkedin').value;
  const website = document.getElementById('website').value;
  const summary = document.getElementById('summary').value;

  // Check if required fields are filled
  if (!name || !email || !phone || !address || !summary) {
    alert('Please fill in all required fields (marked with *)');
    button.classList.remove('loading');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPosition = 20;

    // Header with name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(name.toUpperCase(), 20, yPosition);
    yPosition += 10;

    // Contact information
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let contactInfo = `${email} | ${phone} | ${address}`;
    if (linkedin) contactInfo += ` | ${linkedin}`;
    if (website) contactInfo += ` | ${website}`;
    
    const splitContact = doc.splitTextToSize(contactInfo, 170);
    doc.text(splitContact, 20, yPosition);
    yPosition += splitContact.length * 5 + 10;

    // Professional Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const splitSummary = doc.splitTextToSize(summary, 170);
    doc.text(splitSummary, 20, yPosition);
    yPosition += splitSummary.length * 5 + 10;

    // Work Experience
    const experiences = getExperienceData();
    if (experiences.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('WORK EXPERIENCE', 20, yPosition);
      yPosition += 8;

      experiences.forEach(exp => {
        if (exp.jobTitle && exp.company) {
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text(`${exp.jobTitle} - ${exp.company}`, 20, yPosition);
          yPosition += 6;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          let jobInfo = exp.duration;
          if (exp.location) jobInfo += ` | ${exp.location}`;
          doc.text(jobInfo, 20, yPosition);
          yPosition += 6;

          if (exp.responsibilities) {
            const splitResp = doc.splitTextToSize(exp.responsibilities, 170);
            doc.text(splitResp, 20, yPosition);
            yPosition += splitResp.length * 4 + 5;
          }
          yPosition += 5;
        }
      });
    }

    // Education
    const education = getEducationData();
    if (education.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('EDUCATION', 20, yPosition);
      yPosition += 8;

      education.forEach(edu => {
        if (edu.degree && edu.school) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text(edu.degree, 20, yPosition);
          yPosition += 6;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          let eduInfo = edu.school;
          if (edu.graduationYear) eduInfo += ` | ${edu.graduationYear}`;
          if (edu.gpa) eduInfo += ` | GPA: ${edu.gpa}`;
          if (edu.honors) eduInfo += ` | ${edu.honors}`;
          
          const splitEdu = doc.splitTextToSize(eduInfo, 170);
          doc.text(splitEdu, 20, yPosition);
          yPosition += splitEdu.length * 4 + 8;
        }
      });
    }

    // Skills
    const technicalSkills = document.getElementById('technicalSkills').value;
    const softSkills = document.getElementById('softSkills').value;
    
    if (technicalSkills || softSkills) {
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('SKILLS', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      if (technicalSkills) {
        doc.setFont('helvetica', 'bold');
        doc.text('Technical:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        const splitTech = doc.splitTextToSize(technicalSkills, 150);
        doc.text(splitTech, 50, yPosition);
        yPosition += splitTech.length * 5 + 3;
      }

      if (softSkills) {
        doc.setFont('helvetica', 'bold');
        doc.text('Soft Skills:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        const splitSoft = doc.splitTextToSize(softSkills, 150);
        doc.text(splitSoft, 50, yPosition);
        yPosition += splitSoft.length * 5 + 8;
      }
    }

    // Additional sections
    yPosition = addOptionalSection(doc, 'certifications', 'CERTIFICATIONS', yPosition);
    yPosition = addOptionalSection(doc, 'projects', 'PROJECTS', yPosition);
    yPosition = addOptionalSection(doc, 'languages', 'LANGUAGES', yPosition);

    doc.save(`${name.replace(/\s+/g, '_')}_Resume.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    button.classList.remove('loading');
  }
}

function getExperienceData() {
  const experiences = [];
  for (let i = 1; i <= experienceCount; i++) {
    const jobTitle = document.getElementById(`jobTitle${i}`)?.value;
    const company = document.getElementById(`company${i}`)?.value;
    const location = document.getElementById(`location${i}`)?.value;
    const duration = document.getElementById(`duration${i}`)?.value;
    const responsibilities = document.getElementById(`responsibilities${i}`)?.value;

    if (jobTitle || company) {
      experiences.push({
        jobTitle: jobTitle || '',
        company: company || '',
        location: location || '',
        duration: duration || '',
        responsibilities: responsibilities || ''
      });
    }
  }
  return experiences;
}

function getEducationData() {
  const educations = [];
  for (let i = 1; i <= educationCount; i++) {
    const degree = document.getElementById(`degree${i}`)?.value;
    const school = document.getElementById(`school${i}`)?.value;
    const graduationYear = document.getElementById(`graduationYear${i}`)?.value;
    const gpa = document.getElementById(`gpa${i}`)?.value;
    const honors = document.getElementById(`honors${i}`)?.value;

    if (degree || school) {
      educations.push({
        degree: degree || '',
        school: school || '',
        graduationYear: graduationYear || '',
        gpa: gpa || '',
        honors: honors || ''
      });
    }
  }
  return educations;
}

function addOptionalSection(doc, fieldId, title, startY) {
  const content = document.getElementById(fieldId)?.value;
  if (!content) return startY;

  let yPosition = startY;
  
  // Check if we need a new page
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const splitContent = doc.splitTextToSize(content, 170);
  doc.text(splitContent, 20, yPosition);
  yPosition += splitContent.length * 5 + 10;
  
  return yPosition;
}