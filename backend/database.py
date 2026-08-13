import sqlite3
import os
import shutil
import hashlib
import secrets
import textwrap
from datetime import datetime

from docx_loader import extract_topics_from_docx


DB_DIR = "student_data"
DB_PATH = os.path.join(DB_DIR, "results.db")
PASS_PERCENTAGE = 70

os.makedirs(DB_DIR, exist_ok=True)


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password):
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    ).hex()
    return f"{salt}${password_hash}"


def verify_password(password, stored_hash):
    try:
        salt, password_hash = stored_hash.split("$")
        new_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        ).hex()
        return secrets.compare_digest(new_hash, password_hash)
    except Exception:
        return False


def normalize_study_content(content: str) -> str:
    """
    Cleans study material coming from Word document.
    Removes unwanted spacing and keeps headings clean.
    """

    if not content:
        return ""

    content = textwrap.dedent(content)

    lines = content.splitlines()
    cleaned_lines = []

    section_headings = {
        "simple explanation",
        "what is happening in the image",
        "real-life examples",
        "important points",
        "board exam tip",
        "quick recap",
        "formula",
        "meaning of symbols",
        "meaning",
        "example"
    }

    for line in lines:
        line = " ".join(line.strip().split())

        if not line:
            cleaned_lines.append("")
            continue

        lower = line.lower().replace(":", "").strip()

        if lower in section_headings:
            line = line.replace(":", "").strip()
            cleaned_lines.append("")
            cleaned_lines.append(line)
            cleaned_lines.append("")
        else:
            cleaned_lines.append(line)

    final_lines = []
    previous_blank = False

    for line in cleaned_lines:
        if line == "":
            if not previous_blank:
                final_lines.append(line)
            previous_blank = True
        else:
            final_lines.append(line)
            previous_blank = False

    return "\n".join(final_lines).strip()


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        order_no INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        order_no INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        material_type TEXT,
        content TEXT,
        file_path TEXT,
        video_path TEXT,
        reference_url TEXT,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id),
        FOREIGN KEY (topic_id) REFERENCES topics(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS topic_quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        question_type TEXT NOT NULL,
        question TEXT NOT NULL,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option TEXT,
        expected_answer TEXT,
        marks INTEGER DEFAULT 1,
        FOREIGN KEY (topic_id) REFERENCES topics(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chapter_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        question_type TEXT NOT NULL,
        question TEXT NOT NULL,
        scenario_context TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option TEXT,
        expected_answer TEXT,
        marks INTEGER DEFAULT 5,
        bloom_level TEXT,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        chapter_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        is_unlocked INTEGER DEFAULT 0,
        is_studied INTEGER DEFAULT 0,
        topic_quiz_passed INTEGER DEFAULT 0,
        topic_quiz_score REAL DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        updated_at TEXT,
        UNIQUE(student_id, topic_id),
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (chapter_id) REFERENCES chapters(id),
        FOREIGN KEY (topic_id) REFERENCES topics(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chapter_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        chapter_id INTEGER NOT NULL,
        is_unlocked INTEGER DEFAULT 0,
        final_test_unlocked INTEGER DEFAULT 0,
        final_test_passed INTEGER DEFAULT 0,
        final_test_score REAL DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        updated_at TEXT,
        UNIQUE(student_id, chapter_id),
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS topic_quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        topic_id INTEGER,
        total_marks REAL,
        obtained_marks REAL,
        percentage REAL,
        passed INTEGER,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chapter_test_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        chapter_id INTEGER,
        total_marks REAL,
        obtained_marks REAL,
        percentage REAL,
        passed INTEGER,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT,
        question TEXT,
        student_answer TEXT,
        evaluation TEXT
    )
    """)

    # Migration for study_materials: add reference_url if it doesn't exist in existing DB
    cursor.execute("PRAGMA table_info(study_materials)")
    columns = [row["name"] for row in cursor.fetchall()]
    if "reference_url" not in columns:
        cursor.execute("ALTER TABLE study_materials ADD COLUMN reference_url TEXT")

    # Create default admin automatically if not exists
    cursor.execute("SELECT COUNT(*) FROM admins WHERE username = 'admin'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO admins (username, password_hash, created_at)
        VALUES (?, ?, ?)
        """, ("admin", hash_password("admin123"), datetime.now().isoformat()))

    conn.commit()
    conn.close()


def seed_chapter_from_docx(chapter_id, docx_path):
    """
    Seeds topics and study materials from a DOCX file for a specific chapter.
    Also seeds the corresponding quizzes and tests.
    """
    if not os.path.exists(docx_path):
        return

    extracted_topics = extract_topics_from_docx(docx_path)
    if not extracted_topics:
        return

    conn = get_connection()
    cursor = conn.cursor()

    # Get chapter order_no
    cursor.execute("SELECT order_no FROM chapters WHERE id = ?", (chapter_id,))
    ch_row = cursor.fetchone()
    order_no = ch_row["order_no"] if ch_row else 1

    topic_ids = []
    for topic in extracted_topics:
        cursor.execute("""
        INSERT INTO topics (chapter_id, title, order_no)
        VALUES (?, ?, ?)
        """, (chapter_id, topic["title"], topic["topic_no"]))
        topic_ids.append(cursor.lastrowid)

    materials = []
    for index, topic in enumerate(extracted_topics):
        topic_id = topic_ids[index]
        topic_no = topic["topic_no"]
        cleaned_content = normalize_study_content(topic["content"])
        
        if order_no == 1:
            video_path = f"videos/chapter1_topic{topic_no}.mp4"
        else:
            video_path = f"videos/chapter{order_no}_topic{topic_no}.mp4"

        materials.append((
            chapter_id,
            topic_id,
            topic["title"],
            "notes",
            cleaned_content,
            f"data/pdfs/chapter{order_no}.pdf",
            video_path
        ))

    cursor.executemany("""
    INSERT INTO study_materials
    (chapter_id, topic_id, title, material_type, content, file_path, video_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, materials)

    # Now seed quizzes and tests for this chapter
    if order_no == 1:
        # Seed Chapter 1 quizzes
        quiz_questions = []
        if len(topic_ids) >= 1:
            quiz_questions.extend([
                (topic_ids[0], "mcq", "How many types of electric charges are there?", "One", "Two", "Three", "Four", "B", "There are two types of charges: positive and negative.", 1),
                (topic_ids[0], "mcq", "Like charges will:", "Attract", "Repel", "Disappear", "Become neutral", "B", "Like charges repel each other.", 1),
                (topic_ids[0], "short_answer", "What happens when a body loses electrons?", "", "", "", "", "", "The body becomes positively charged when it loses electrons.", 2),
            ])
        if len(topic_ids) >= 2:
            quiz_questions.extend([
                (topic_ids[1], "mcq", "Which of the following is a conductor?", "Plastic", "Rubber", "Copper wire", "Glass", "C", "Copper wire is a conductor because charges can move easily through it.", 1),
                (topic_ids[1], "mcq", "Which of the following is an insulator?", "Copper", "Iron", "Human body", "Rubber", "D", "Rubber is an insulator because charges cannot move easily through it.", 1),
                (topic_ids[1], "short_answer", "Why are metals good conductors?", "", "", "", "", "", "Metals are good conductors because they have free electrons that can move easily inside the material.", 2),
            ])
        if len(topic_ids) >= 3:
            quiz_questions.extend([
                (topic_ids[2], "mcq", "Which of the following is an important property of electric charge?", "Charge is always zero", "Charge is conserved", "Charge has no effect", "Charge cannot be transferred", "B", "Electric charge is conserved. It cannot be created or destroyed, only transferred.", 1),
                (topic_ids[2], "mcq", "Like charges:", "Attract each other", "Repel each other", "Do not interact", "Become neutral always", "B", "Like charges repel each other.", 1),
                (topic_ids[2], "short_answer", "What is conservation of charge?", "", "", "", "", "", "Conservation of charge means charge cannot be created or destroyed; it can only be transferred from one body to another.", 2),
            ])
        if len(topic_ids) >= 4:
            quiz_questions.extend([
                (topic_ids[3], "mcq", "Coulomb's law follows which relation with distance?", "Direct relation", "Inverse square relation", "Linear relation", "No relation", "B", "Coulomb's law follows inverse square relation with distance.", 1),
                (topic_ids[3], "mcq", "Formula of Coulomb's law is:", "F = ma", "F = k q1 q2 / r²", "E = F/q", "V = IR", "B", "Formula is F = k q1 q2 / r².", 1),
                (topic_ids[3], "short_answer", "State Coulomb's law.", "", "", "", "", "", "Electrostatic force between two point charges is directly proportional to product of charges and inversely proportional to square of distance between them.", 3),
            ])
        if len(topic_ids) >= 5:
            quiz_questions.extend([
                (topic_ids[4], "mcq", "Electric field is defined as:", "Force per unit charge", "Charge per unit force", "Force multiplied by charge", "Distance per charge", "A", "Electric field is force per unit charge.", 1),
                (topic_ids[4], "mcq", "Electric field lines from a positive charge are directed:", "Inward", "Outward", "Circular only", "Randomly", "B", "Electric field lines from a positive charge are directed outward.", 1),
                (topic_ids[4], "short_answer", "Define electric field.", "", "", "", "", "", "Electric field is the force experienced by a unit positive test charge placed at a point.", 2),
            ])
        if len(topic_ids) >= 6:
            quiz_questions.extend([
                (topic_ids[5], "mcq", "Electric flux means:", "Charge stored in a battery", "Electric field passing through a surface", "Current in a wire", "Resistance of a conductor", "B", "Electric flux means electric field passing through a surface.", 1),
                (topic_ids[5], "mcq", "A Gaussian surface is:", "A real metal surface only", "An imaginary closed surface", "A battery terminal", "A wire loop only", "B", "A Gaussian surface is an imaginary closed surface used in Gauss's law.", 1),
                (topic_ids[5], "short_answer", "What does Gauss's law relate?", "", "", "", "", "", "Gauss's law relates electric flux through a closed surface to the charge enclosed inside that surface.", 2),
            ])
        if quiz_questions:
            cursor.executemany("""
            INSERT INTO topic_quizzes
            (topic_id, question_type, question, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, quiz_questions)

        # Seed Chapter 1 test questions (20 questions: 7 Remembering, 7 Understanding, 6 Applying)
        chapter_test_questions = [
            # 7 Remembering (MCQs, 1-2 marks)
            (chapter_id, "mcq", "The quantization of electric charge is expressed by which equation?", "", "q = ne", "q = E/c", "q = I/t", "q = F*r", "A", "q = ne", 1, "Remembering"),
            (chapter_id, "mcq", "What is the SI unit of electric permittivity of free space (ε0)?", "", "N m² C⁻²", "C² N⁻¹ m⁻²", "N C⁻¹", "J C⁻¹", "B", "C² N⁻¹ m⁻²", 1, "Remembering"),
            (chapter_id, "mcq", "Like electric charges always:", "", "Attract each other", "Repel each other", "Do not interact", "Always become neutral", "B", "Repel each other", 1, "Remembering"),
            (chapter_id, "mcq", "The dimensional formula of electric field intensity E is:", "", "[M L T⁻³ A⁻¹]", "[M L² T⁻³ A⁻¹]", "[M L T⁻² A⁻¹]", "[M L² T⁻² A⁻²]", "A", "[M L T⁻³ A⁻¹]", 1, "Remembering"),
            (chapter_id, "mcq", "What is the net electric flux passing through a closed Gaussian surface enclosing zero net charge?", "", "Infinite", "Zero", "Depends on area", "q/ε0", "B", "Zero", 1, "Remembering"),
            (chapter_id, "mcq", "The torque experienced by an electric dipole of moment p in uniform field E is:", "", "p · E", "p × E", "p / E", "E × p", "B", "p × E", 1, "Remembering"),
            (chapter_id, "mcq", "The electric field inside a uniformly charged thin spherical shell is:", "", "Zero", "Uniform and positive", "Inversely proportional to r", "Infinite", "A", "Zero", 1, "Remembering"),

            # 7 Understanding (Short Answer, 3 marks)
            (chapter_id, "short_answer", "State Coulomb's Law and write its vector formula.", "", "", "", "", "", "", "Coulomb's Law states that the electrostatic force between two stationary point charges is directly proportional to the product of magnitudes of charges and inversely proportional to the square of distance between them. Vector formula: F12 = (1 / 4πε0) * (q1 * q2 / r²) * r_hat.", 3, "Understanding"),
            (chapter_id, "short_answer", "Why can two electric field lines never cross each other?", "", "", "", "", "", "", "Electric field lines never intersect because if they did, at the point of intersection there would be two tangents, meaning two different directions of the net electric field at the same single point, which is physically impossible.", 3, "Understanding"),
            (chapter_id, "short_answer", "State and explain Gauss's Law in electrostatics.", "", "", "", "", "", "", "Gauss's Law states that the total electric flux (Φ) through any closed surface is equal to 1/ε0 times the net charge enclosed inside that closed surface: Φ = ∮ E · dA = q_enclosed / ε0.", 3, "Understanding"),
            (chapter_id, "short_answer", "Explain the concept of quantization of charge. Can it be observed at macroscopic levels?", "", "", "", "", "", "", "Quantization of charge means that any observable charge on a body is always an integral multiple of the basic elementary charge: q = ±ne (where e = 1.6 × 10⁻¹⁹ C). At macroscopic levels, where charges are on the order of microcoulombs, n is huge (~10¹³), so the discrete nature can be ignored and charge is treated as continuous.", 3, "Understanding"),
            (chapter_id, "short_answer", "Derive the electric field on the axial line of an electric dipole.", "", "", "", "", "", "", "For a dipole with charges -q and +q separated by 2a, at an axial distance r (where r >> a), the net electric field is E_axial = (1 / 4πε0) * (2pr / (r² - a²)²) ≈ (1 / 4πε0) * (2p / r³), pointing along the dipole moment vector p.", 3, "Understanding"),
            (chapter_id, "short_answer", "Derive the electric field on the equatorial line of an electric dipole.", "", "", "", "", "", "", "At an equatorial distance r from the center of a dipole (where r >> a), vertical field components cancel and horizontal components add. The net field is E_equatorial = (1 / 4πε0) * (p / (r² + a²)^(3/2)) ≈ (1 / 4πε0) * (p / r³), pointing anti-parallel to the dipole moment vector p.", 3, "Understanding"),
            (chapter_id, "short_answer", "Explain how charging by induction differs from charging by conduction.", "", "", "", "", "", "", "In conduction, charge is transferred through direct physical contact, and the uncharged body acquires the same nature of charge. In induction, an uncharged body is brought near a charged body without contact; opposite charge is induced on the near end and similar charge on the far end, which can then be grounded to leave a permanent opposite charge.", 3, "Understanding"),

            # 6 Applying / Scenario-based (5 marks)
            (chapter_id, "scenario", "A plastic comb is rubbed with dry hair and then it attracts small pieces of paper. Explain in detail the step-by-step electrostatic physics behind this phenomenon.", "A plastic comb is rubbed with dry hair and held near bits of paper.", "", "", "", "", "", "1. When rubbed with dry hair, electrons transfer from hair to comb due to friction, giving the comb a net negative charge. 2. When the charged comb is brought near neutral paper pieces, it induces positive charges on the near side and negative charges on the far side of the paper bits. 3. Since the attractive force on the near positive side is stronger than the repulsive force on the far negative side (Coulomb's inverse square law), the net electrostatic force is attractive, pulling the paper pieces up to the comb.", 5, "Applying"),
            (chapter_id, "scenario", "Two identical metallic spheres A and B have charges +4μC and -2μC respectively. They are brought into contact, separated, and placed 10 cm apart in air. Calculate the final electrostatic force between them and determine whether it is attractive or repulsive.", "Two charged spheres brought into contact and separated.", "", "", "", "", "", "When touched, the total charge divides equally: q_total = (+4) + (-2) = +2 μC. Each sphere gets q = 2/2 = +1 μC = 10⁻⁶ C. When separated by r = 0.1 m, the force is F = k * (q1 * q2) / r² = (9 × 10⁹) * (10⁻⁶ * 10⁻⁶) / (0.1)² = (9 × 10⁻³) / 0.01 = 0.9 N. Since both charges are positive, the force is repulsive.", 5, "Applying"),
            (chapter_id, "scenario", "An electric dipole with dipole moment p = 4 × 10⁻⁹ C m is aligned at an angle of 30° with the direction of a uniform electric field of magnitude E = 5 × 10⁴ N/C. (a) Calculate the magnitude of torque acting on the dipole. (b) Find the work done in rotating the dipole from 0° to 180°.", "Electric dipole in uniform electric field.", "", "", "", "", "", "(a) Magnitude of torque: τ = p * E * sin(θ) = (4 × 10⁻⁹) * (5 × 10⁴) * sin(30°) = 2 × 10⁻⁴ * 0.5 = 1.0 × 10⁻⁴ N m. (b) Work done in rotating from 0° to 180°: W = -pE(cos 180° - cos 0°) = -pE(-1 - 1) = 2pE = 2 * (4 × 10⁻⁹) * (5 × 10⁴) = 4.0 × 10⁻⁴ J.", 5, "Applying"),
            (chapter_id, "scenario", "Using Gauss's Law, derive the expression for the electric field due to an infinitely long, straight, uniformly charged wire with linear charge density λ at a perpendicular distance r.", "Applying Gauss's law for an infinitely long charged wire.", "", "", "", "", "", "Consider a cylindrical Gaussian surface of radius r and length L coaxial with the charged wire. The electric field E is radially outward. Flux through flat end caps is zero. Flux through curved surface: Φ = E * (2πrL). Enclosed charge q_in = λ * L. By Gauss's Law: E * (2πrL) = (λL) / ε0 => E = λ / (2πε0 r). The electric field is inversely proportional to distance r.", 5, "Applying"),
            (chapter_id, "scenario", "A point charge of +2μC is placed at the center of a cubic Gaussian surface of edge 9 cm. (a) What is the net electric flux through the entire cube? (b) What is the electric flux through each of the six individual faces of the cube? Explain your reasoning.", "Point charge at center of cubic Gaussian box.", "", "", "", "", "", "(a) Total flux through the cube by Gauss's Law: Φ_total = q / ε0 = (2 × 10⁻⁶ C) / (8.854 × 10⁻¹² C² N⁻¹ m⁻²) ≈ 2.26 × 10⁵ N m²/C. (b) Since the charge is placed symmetrically at the center of the cube, flux through any single face is Φ_face = Φ_total / 6 = (2.26 × 10⁵) / 6 ≈ 3.77 × 10⁴ N m²/C.", 5, "Applying"),
            (chapter_id, "scenario", "Two point charges q1 = +16μC and q2 = -9μC are located in air 8 cm apart. Determine the location of the point on the line passing through both charges at which the net electric field is zero.", "Finding the neutral point of zero electric field for two opposite unequal charges.", "", "", "", "", "", "The neutral point lies outside closer to the smaller magnitude charge (-9μC). Let distance be x to the right of q2: E1 = E2 => 16 / (8 + x)² = 9 / x² => 4 / (8 + x) = 3 / x => 4x = 24 + 3x => x = 24 cm. Thus, the net electric field is zero at a point 24 cm away from the -9μC charge.", 5, "Applying")
        ]
        cursor.executemany("""
        INSERT INTO chapter_tests
        (chapter_id, question_type, question, scenario_context, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks, bloom_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, chapter_test_questions)

    elif order_no == 2:
        # Seed Chapter 2 quizzes and tests from chapter2_data.py
        import sys
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from chapter2_data import CHAPTER_2_QUIZZES as ch2_quizzes, CHAPTER_2_TESTS as ch2_tests
        
        quiz_questions = []
        for q in ch2_quizzes:
            topic_idx = q["topic_no"] - 1
            if topic_idx < len(topic_ids):
                t_id = topic_ids[topic_idx]
                quiz_questions.append((
                    t_id,
                    q["question_type"],
                    q["question"],
                    q.get("option_a", ""),
                    q.get("option_b", ""),
                    q.get("option_c", ""),
                    q.get("option_d", ""),
                    q.get("correct_option", ""),
                    q.get("expected_answer", ""),
                    q["marks"]
                ))
        if quiz_questions:
            cursor.executemany("""
            INSERT INTO topic_quizzes
            (topic_id, question_type, question, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, quiz_questions)

        test_questions = []
        for q in ch2_tests:
            test_questions.append((
                chapter_id,
                q["question_type"],
                q["question"],
                q.get("scenario_context", ""),
                q.get("option_a", ""),
                q.get("option_b", ""),
                q.get("option_c", ""),
                q.get("option_d", ""),
                q.get("correct_option", ""),
                q.get("expected_answer", ""),
                q["marks"],
                q["bloom_level"]
            ))
        if test_questions:
            cursor.executemany("""
            INSERT INTO chapter_tests
            (chapter_id, question_type, question, scenario_context, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks, bloom_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, test_questions)

    conn.commit()
    conn.close()

def reinit_chapter_progress_for_student(student_id, chapter_id):
    """
    Initializes/resets topic progress for a specific student and chapter.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT order_no FROM chapters WHERE id = ?", (chapter_id,))
    ch_row = cursor.fetchone()
    order_no = ch_row["order_no"] if ch_row else 1

    cursor.execute("SELECT is_unlocked FROM chapter_progress WHERE student_id = ? AND chapter_id = ?", (student_id, chapter_id))
    cp_row = cursor.fetchone()
    
    if cp_row:
        ch_unlocked = cp_row["is_unlocked"] == 1
    else:
        ch_unlocked = order_no == 1
        cursor.execute("""
        INSERT OR IGNORE INTO chapter_progress
        (student_id, chapter_id, is_unlocked, final_test_unlocked, final_test_passed, final_test_score, is_completed, updated_at)
        VALUES (?, ?, ?, 0, 0, 0, 0, ?)
        """, (student_id, chapter_id, 1 if ch_unlocked else 0, datetime.now().isoformat()))

    cursor.execute("SELECT id, order_no FROM topics WHERE chapter_id = ? ORDER BY order_no", (chapter_id,))
    topics = cursor.fetchall()

    for topic in topics:
        is_first_topic = ch_unlocked and topic["order_no"] == 1

        cursor.execute("""
        INSERT OR REPLACE INTO student_progress
        (student_id, chapter_id, topic_id, is_unlocked, is_studied, topic_quiz_passed, topic_quiz_score, is_completed, updated_at)
        VALUES (?, ?, ?, ?, 0, 0, 0, 0, ?)
        """, (
            student_id,
            chapter_id,
            topic["id"],
            1 if is_first_topic else 0,
            datetime.now().isoformat()
        ))

    conn.commit()
    conn.close()

def seed_learning_data():
    conn = get_connection()
    cursor = conn.cursor()

    # Create chapters if they don't exist
    chapters_to_seed = [
        {"title": "Electric Charges and Fields", "order_no": 1, "docx": os.path.join("data", "chapters", "chapter1_study_materials.docx")},
        {"title": "Electrostatic Potential and Capacitance", "order_no": 2, "docx": os.path.join("data", "chapters", "chapter2_study_materials.docx")}
    ]

    ch1_fallback = os.path.join("data", "study_materials.docx")
    if not os.path.exists(chapters_to_seed[0]["docx"]) and os.path.exists(ch1_fallback):
        os.makedirs(os.path.join("data", "chapters"), exist_ok=True)
        shutil.copy(ch1_fallback, chapters_to_seed[0]["docx"])

    for ch in chapters_to_seed:
        cursor.execute("SELECT id FROM chapters WHERE order_no = ?", (ch["order_no"],))
        row = cursor.fetchone()
        if not row:
            cursor.execute("INSERT INTO chapters (title, order_no) VALUES (?, ?)", (ch["title"], ch["order_no"]))
            chapter_id = cursor.lastrowid
            conn.commit()
            seed_chapter_from_docx(chapter_id, ch["docx"])
        else:
            chapter_id = row["id"]
            cursor.execute("SELECT COUNT(*) FROM topics WHERE chapter_id = ?", (chapter_id,))
            if cursor.fetchone()[0] == 0:
                conn.commit()
                seed_chapter_from_docx(chapter_id, ch["docx"])

    conn.commit()
    conn.close()


def create_user(full_name, email, password):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO users (full_name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?)
        """, (full_name, email, hash_password(password), datetime.now().isoformat()))

        student_id = cursor.lastrowid
        conn.commit()
        conn.close()

        initialize_student_progress(student_id)

        return {
            "success": True,
            "message": "User registered successfully",
            "user": {
                "id": student_id,
                "full_name": full_name,
                "email": email
            }
        }

    except sqlite3.IntegrityError:
        conn.close()
        return {
            "success": False,
            "message": "Email already registered"
        }


def login_user(email, password):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return {"success": False, "message": "User not found"}

    if not verify_password(password, user["password_hash"]):
        return {"success": False, "message": "Invalid password"}

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"]
        }
    }


def initialize_student_progress(student_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM chapters ORDER BY order_no")
    chapters = cursor.fetchall()

    for chapter in chapters:
        is_first_chapter = chapter["order_no"] == 1

        cursor.execute("""
        INSERT OR IGNORE INTO chapter_progress
        (student_id, chapter_id, is_unlocked, final_test_unlocked, final_test_passed, final_test_score, is_completed, updated_at)
        VALUES (?, ?, ?, 0, 0, 0, 0, ?)
        """, (
            student_id,
            chapter["id"],
            1 if is_first_chapter else 0,
            datetime.now().isoformat()
        ))

        cursor.execute("""
        SELECT * FROM topics
        WHERE chapter_id = ?
        ORDER BY order_no
        """, (chapter["id"],))

        topics = cursor.fetchall()

        for topic in topics:
            is_first_topic = is_first_chapter and topic["order_no"] == 1

            cursor.execute("""
            INSERT OR IGNORE INTO student_progress
            (student_id, chapter_id, topic_id, is_unlocked, is_studied, topic_quiz_passed, topic_quiz_score, is_completed, updated_at)
            VALUES (?, ?, ?, ?, 0, 0, 0, 0, ?)
            """, (
                student_id,
                chapter["id"],
                topic["id"],
                1 if is_first_topic else 0,
                datetime.now().isoformat()
            ))

    conn.commit()
    conn.close()


def get_chapters(student_id=None):
    conn = get_connection()
    cursor = conn.cursor()

    if student_id:
        cursor.execute("""
        SELECT c.*, cp.is_unlocked, cp.final_test_unlocked, cp.final_test_passed, cp.final_test_score, cp.is_completed
        FROM chapters c
        LEFT JOIN chapter_progress cp 
        ON c.id = cp.chapter_id AND cp.student_id = ?
        ORDER BY c.order_no
        """, (student_id,))
    else:
        cursor.execute("""
        SELECT *
        FROM chapters
        ORDER BY order_no
        """)

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_topics(chapter_id, student_id=None):
    conn = get_connection()
    cursor = conn.cursor()

    if student_id:
        cursor.execute("""
        SELECT t.*, sp.is_unlocked, sp.is_studied, sp.topic_quiz_passed, sp.topic_quiz_score, sp.is_completed
        FROM topics t
        LEFT JOIN student_progress sp
        ON t.id = sp.topic_id AND sp.student_id = ?
        WHERE t.chapter_id = ?
        ORDER BY t.order_no
        """, (student_id, chapter_id))
    else:
        cursor.execute("""
        SELECT *
        FROM topics
        WHERE chapter_id = ?
        ORDER BY order_no
        """, (chapter_id,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_study_materials(topic_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM study_materials
    WHERE topic_id = ?
    """, (topic_id,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def is_topic_unlocked(student_id, topic_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT is_unlocked
    FROM student_progress
    WHERE student_id = ? AND topic_id = ?
    """, (student_id, topic_id))

    row = cursor.fetchone()
    conn.close()

    return bool(row and row["is_unlocked"] == 1)


def mark_topic_studied(student_id, topic_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE student_progress
    SET is_studied = 1, updated_at = ?
    WHERE student_id = ? AND topic_id = ?
    """, (
        datetime.now().isoformat(),
        student_id,
        topic_id
    ))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Topic marked as studied. Topic quiz is now available."
    }


def get_topic_quiz(topic_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, topic_id, question_type, question, option_a, option_b, option_c, option_d, marks
    FROM topic_quizzes
    WHERE topic_id = ?
    """, (topic_id,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_topic_quiz_with_answers(topic_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM topic_quizzes
    WHERE topic_id = ?
    """, (topic_id,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_chapter_test(chapter_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, chapter_id, question_type, question, scenario_context, option_a, option_b, option_c, option_d, marks, bloom_level
    FROM chapter_tests
    WHERE chapter_id = ?
    """, (chapter_id,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_chapter_test_with_answers(chapter_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM chapter_tests
    WHERE chapter_id = ?
    """, (chapter_id,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def keyword_score(student_answer, expected_answer, marks):
    student_words = set(
        student_answer.lower()
        .replace(".", " ")
        .replace(",", " ")
        .replace(":", " ")
        .replace(";", " ")
        .split()
    )

    expected_words = set(
        expected_answer.lower()
        .replace(".", " ")
        .replace(",", " ")
        .replace(":", " ")
        .replace(";", " ")
        .split()
    )

    important_words = {word for word in expected_words if len(word) > 3}

    if not important_words:
        return 0

    matched_words = student_words.intersection(important_words)
    ratio = len(matched_words) / len(important_words)

    obtained = round(ratio * marks, 2)

    if obtained > marks:
        obtained = marks

    return obtained


def save_topic_quiz_attempt(student_id, topic_id, total_marks, obtained_marks, percentage, passed):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO topic_quiz_attempts
    (student_id, topic_id, total_marks, obtained_marks, percentage, passed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        student_id,
        topic_id,
        total_marks,
        obtained_marks,
        percentage,
        1 if passed else 0,
        datetime.now().isoformat()
    ))

    conn.commit()
    conn.close()


def update_topic_progress_after_quiz(student_id, topic_id, percentage, passed):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT chapter_id, order_no
    FROM topics
    WHERE id = ?
    """, (topic_id,))

    current_topic = cursor.fetchone()

    if not current_topic:
        conn.close()
        return

    chapter_id = current_topic["chapter_id"]

    cursor.execute("""
    UPDATE student_progress
    SET topic_quiz_passed = ?, topic_quiz_score = ?, is_completed = ?, updated_at = ?
    WHERE student_id = ? AND topic_id = ?
    """, (
        1 if passed else 0,
        percentage,
        1 if passed else 0,
        datetime.now().isoformat(),
        student_id,
        topic_id
    ))

    if passed:
        cursor.execute("""
        SELECT id
        FROM topics
        WHERE chapter_id = ? AND order_no > ?
        ORDER BY order_no ASC
        LIMIT 1
        """, (
            chapter_id,
            current_topic["order_no"]
        ))

        next_topic = cursor.fetchone()

        if next_topic:
            cursor.execute("""
            UPDATE student_progress
            SET is_unlocked = 1, updated_at = ?
            WHERE student_id = ? AND topic_id = ?
            """, (
                datetime.now().isoformat(),
                student_id,
                next_topic["id"]
            ))
        else:
            cursor.execute("""
            UPDATE chapter_progress
            SET final_test_unlocked = 1, updated_at = ?
            WHERE student_id = ? AND chapter_id = ?
            """, (
                datetime.now().isoformat(),
                student_id,
                chapter_id
            ))

    conn.commit()
    conn.close()


def save_chapter_test_attempt(student_id, chapter_id, total_marks, obtained_marks, percentage, passed):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO chapter_test_attempts
    (student_id, chapter_id, total_marks, obtained_marks, percentage, passed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        student_id,
        chapter_id,
        total_marks,
        obtained_marks,
        percentage,
        1 if passed else 0,
        datetime.now().isoformat()
    ))

    conn.commit()
    conn.close()


def update_chapter_progress_after_test(student_id, chapter_id, percentage, passed):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE chapter_progress
    SET final_test_passed = ?, final_test_score = ?, is_completed = ?, updated_at = ?
    WHERE student_id = ? AND chapter_id = ?
    """, (
        1 if passed else 0,
        percentage,
        1 if passed else 0,
        datetime.now().isoformat(),
        student_id,
        chapter_id
    ))

    if passed:
        cursor.execute("""
        SELECT order_no
        FROM chapters
        WHERE id = ?
        """, (chapter_id,))

        current_chapter = cursor.fetchone()

        if current_chapter:
            cursor.execute("""
            SELECT id
            FROM chapters
            WHERE order_no > ?
            ORDER BY order_no ASC
            LIMIT 1
            """, (current_chapter["order_no"],))

            next_chapter = cursor.fetchone()

            if next_chapter:
                cursor.execute("""
                UPDATE chapter_progress
                SET is_unlocked = 1, updated_at = ?
                WHERE student_id = ? AND chapter_id = ?
                """, (
                    datetime.now().isoformat(),
                    student_id,
                    next_chapter["id"]
                ))

                # Also unlock the first topic of the next chapter
                cursor.execute("""
                SELECT id
                FROM topics
                WHERE chapter_id = ?
                ORDER BY order_no ASC
                LIMIT 1
                """, (next_chapter["id"],))
                first_topic = cursor.fetchone()
                if first_topic:
                    cursor.execute("""
                    UPDATE student_progress
                    SET is_unlocked = 1, updated_at = ?
                    WHERE student_id = ? AND topic_id = ?
                    """, (
                        datetime.now().isoformat(),
                        student_id,
                        first_topic["id"]
                    ))

    conn.commit()
    conn.close()


def get_student_progress(student_id):
    return {
        "chapters": get_chapters(student_id)
    }


def save_result(student_name, question, student_answer, evaluation):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO results 
    (student_name, question, student_answer, evaluation)
    VALUES (?, ?, ?, ?)
    """, (
        student_name,
        question,
        student_answer,
        evaluation
    ))

    conn.commit()
    conn.close()


def get_results():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM results
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def login_admin(username, password):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM admins WHERE username = ?", (username,))
    admin = cursor.fetchone()
    conn.close()

    if not admin:
        return {"success": False, "message": "Admin not found"}

    if not verify_password(password, admin["password_hash"]):
        return {"success": False, "message": "Invalid password"}

    return {
        "success": True,
        "message": "Admin login successful",
        "admin": {
            "id": admin["id"],
            "username": admin["username"]
        }
    }


def reload_study_materials_from_docx():
    conn = get_connection()
    cursor = conn.cursor()

    tables_to_clear = [
        "chapters",
        "topics",
        "study_materials",
        "topic_quizzes",
        "chapter_tests",
        "student_progress",
        "chapter_progress",
        "topic_quiz_attempts",
        "chapter_test_attempts"
    ]
    for table in tables_to_clear:
        cursor.execute(f"DELETE FROM {table}")

    conn.commit()
    conn.close()

    # Reseed from word document using existing function
    seed_learning_data()

    # Re-initialize progress for all existing students
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users")
    users = cursor.fetchall()
    conn.close()

    for user in users:
        initialize_student_progress(user["id"])

def reload_study_materials_for_chapter(chapter_id, docx_path):
    """
    Deletes curriculum, quizzes, tests, and student progress for a single chapter,
    then re-seeds and re-initializes them.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Get all topic IDs for this chapter to delete their quizzes and attempts
    cursor.execute("SELECT id FROM topics WHERE chapter_id = ?", (chapter_id,))
    topics = cursor.fetchall()
    topic_ids = [t["id"] for t in topics]

    # Delete study materials, quizzes, and progress for this chapter's topics
    if topic_ids:
        placeholders = ",".join("?" for _ in topic_ids)
        cursor.execute(f"DELETE FROM topic_quizzes WHERE topic_id IN ({placeholders})", topic_ids)
        cursor.execute(f"DELETE FROM student_progress WHERE topic_id IN ({placeholders})", topic_ids)
        cursor.execute(f"DELETE FROM topic_quiz_attempts WHERE topic_id IN ({placeholders})", topic_ids)

    # Delete study materials, topics, and test attempts for this chapter
    cursor.execute("DELETE FROM study_materials WHERE chapter_id = ?", (chapter_id,))
    cursor.execute("DELETE FROM topics WHERE chapter_id = ?", (chapter_id,))
    cursor.execute("DELETE FROM chapter_tests WHERE chapter_id = ?", (chapter_id,))
    cursor.execute("DELETE FROM chapter_test_attempts WHERE chapter_id = ?", (chapter_id,))
    
    # Reset final test statuses for chapter_progress
    cursor.execute("""
    UPDATE chapter_progress
    SET final_test_unlocked = 0, final_test_passed = 0, final_test_score = 0, is_completed = 0, updated_at = ?
    WHERE chapter_id = ?
    """, (datetime.now().isoformat(), chapter_id))

    conn.commit()
    conn.close()

    # 2. Re-seed this chapter from the specified docx file
    seed_chapter_from_docx(chapter_id, docx_path)

    # 3. Re-initialize progress for this chapter for all existing students
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users")
    users = cursor.fetchall()
    conn.close()

    for user in users:
        reinit_chapter_progress_for_student(user["id"], chapter_id)


def get_admin_topics():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT t.id, t.chapter_id, t.title, t.order_no, COUNT(sm.id) AS material_count, sm.video_path, sm.reference_url
    FROM topics t
    LEFT JOIN study_materials sm ON t.id = sm.topic_id
    GROUP BY t.id, t.chapter_id, t.title, t.order_no
    ORDER BY t.chapter_id, t.order_no
    """)

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def update_reference_url(topic_id, reference_url):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE study_materials
    SET reference_url = ?
    WHERE topic_id = ?
    """, (reference_url, topic_id))

    conn.commit()
    conn.close()
    return {"success": True, "message": "Reference URL updated successfully"}


def update_topic_video_path(topic_id, video_path):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE study_materials
    SET video_path = ?
    WHERE topic_id = ?
    """, (video_path, topic_id))

    conn.commit()
    conn.close()
    return {"success": True, "message": "Topic video path updated successfully"}


def get_topic_order_no(topic_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT order_no FROM topics WHERE id = ?", (topic_id,))
    row = cursor.fetchone()
    conn.close()
    return row["order_no"] if row else None


def get_chapter_id_for_topic(topic_id):
    """Returns the chapter_id that a given topic belongs to."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT chapter_id FROM topics WHERE id = ?", (topic_id,))
    row = cursor.fetchone()
    conn.close()
    return row["chapter_id"] if row else None


def get_all_student_progress():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, full_name, email FROM users")
    students = cursor.fetchall()

    cursor.execute("SELECT COUNT(*) FROM topics")
    total_topics_row = cursor.fetchone()
    total_topics = total_topics_row[0] if total_topics_row else 0

    results = []
    for student in students:
        student_id = student["id"]

        # Fetch completed topics count
        cursor.execute("""
        SELECT COUNT(*) FROM student_progress
        WHERE student_id = ? AND is_completed = 1
        """, (student_id,))
        completed_topics = cursor.fetchone()[0]

        # Calculate progress percentage
        progress_percentage = round((completed_topics / total_topics) * 100, 2) if total_topics else 0

        # Fetch chapter progress details
        cursor.execute("""
        SELECT cp.chapter_id, c.title, cp.is_unlocked, cp.final_test_unlocked, cp.final_test_passed, cp.final_test_score, cp.is_completed
        FROM chapter_progress cp
        JOIN chapters c ON cp.chapter_id = c.id
        WHERE cp.student_id = ?
        ORDER BY c.order_no
        """, (student_id,))
        chapter_rows = cursor.fetchall()
        chapters_progress = [dict(row) for row in chapter_rows]

        results.append({
            "student_id": student_id,
            "full_name": student["full_name"],
            "email": student["email"],
            "completed_topics": completed_topics,
            "total_topics": total_topics,
            "progress_percentage": progress_percentage,
            "chapters_progress": chapters_progress
        })

    conn.close()
    return results


def update_study_material_content(topic_id, content):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE study_materials
    SET content = ?
    WHERE topic_id = ?
    """, (content, topic_id))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Study material content updated successfully"}


def update_topic_quiz_question(question_id, question, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE topic_quizzes
    SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, expected_answer = ?, marks = ?
    WHERE id = ?
    """, (question, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks, question_id))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Quiz question updated successfully"}


def update_chapter_test_question(question_id, question, scenario_context, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks, bloom_level):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE chapter_tests
    SET question = ?, scenario_context = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, expected_answer = ?, marks = ?, bloom_level = ?
    WHERE id = ?
    """, (question, scenario_context, option_a, option_b, option_c, option_d, correct_option, expected_answer, marks, bloom_level, question_id))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Test question updated successfully"}


def delete_student_by_id(student_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Delete from student_progress
        cursor.execute("DELETE FROM student_progress WHERE student_id = ?", (student_id,))
        # Delete from chapter_progress
        cursor.execute("DELETE FROM chapter_progress WHERE student_id = ?", (student_id,))
        # Delete from topic_quiz_attempts
        cursor.execute("DELETE FROM topic_quiz_attempts WHERE student_id = ?", (student_id,))
        # Delete from chapter_test_attempts
        cursor.execute("DELETE FROM chapter_test_attempts WHERE student_id = ?", (student_id,))
        # Delete from users
        cursor.execute("DELETE FROM users WHERE id = ?", (student_id,))
        
        conn.commit()
        return {"success": True, "message": "Student deleted successfully"}
    except Exception as e:
        conn.rollback()
        return {"success": False, "message": f"Error deleting student: {str(e)}"}
    finally:
        conn.close()