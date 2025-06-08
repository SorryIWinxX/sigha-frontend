export class SemesterService {
  async getSemesters() {
    const response = await fetch('/api/semesters')
    return response.json()
  }
}
